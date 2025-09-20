import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  CreateReviewSchema,
  SearchVideosSchema,
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// OAuth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// User profile endpoints
app.get("/api/profile", authMiddleware, async (c) => {
  const user = c.get("user");

  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user!.id).first();

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json(profile);
});

app.post("/api/profile", authMiddleware, zValidator("json", CreateProfileSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  const preferences = data.preferences ? JSON.stringify(data.preferences) : null;
  const privacy_settings = data.privacy_settings ? JSON.stringify(data.privacy_settings) : null;

  const result = await c.env.DB.prepare(`
    INSERT INTO user_profiles (user_id, display_name, bio, preferences, privacy_settings, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    user!.id,
    data.display_name || null,
    data.bio || null,
    preferences,
    privacy_settings
  ).run();

  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(profile, 201);
});

app.put("/api/profile", authMiddleware, zValidator("json", UpdateProfileSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  const updates: string[] = [];
  const values: any[] = [];

  if (data.display_name !== undefined) {
    updates.push("display_name = ?");
    values.push(data.display_name);
  }
  if (data.bio !== undefined) {
    updates.push("bio = ?");
    values.push(data.bio);
  }
  if (data.preferences !== undefined) {
    updates.push("preferences = ?");
    values.push(JSON.stringify(data.preferences));
  }
  if (data.privacy_settings !== undefined) {
    updates.push("privacy_settings = ?");
    values.push(JSON.stringify(data.privacy_settings));
  }

  updates.push("updated_at = datetime('now')");
  values.push(user!.id);

  await c.env.DB.prepare(`
    UPDATE user_profiles SET ${updates.join(", ")} WHERE user_id = ?
  `).bind(...values).run();

  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user!.id).first();

  return c.json(profile);
});

// Video endpoints
app.get("/api/videos", zValidator("query", SearchVideosSchema), async (c) => {
  const params = c.req.valid("query");
  const { query, category, quality, duration_min, duration_max, sort, page, limit } = params;

  const offset = (page - 1) * limit;

  let sql = `
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM videos v
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE 1=1
  `;
  const bindings: any[] = [];

  if (query) {
    sql += " AND (v.title LIKE ? OR v.description LIKE ?)";
    bindings.push(`%${query}%`, `%${query}%`);
  }

  if (category) {
    sql += " AND c.slug = ?";
    bindings.push(category);
  }

  if (quality) {
    sql += " AND v.quality = ?";
    bindings.push(quality);
  }

  if (duration_min) {
    sql += " AND v.duration >= ?";
    bindings.push(duration_min * 60); // convert minutes to seconds
  }

  if (duration_max) {
    sql += " AND v.duration <= ?";
    bindings.push(duration_max * 60);
  }

  // Add sorting
  switch (sort) {
    case 'newest':
      sql += " ORDER BY v.created_at DESC";
      break;
    case 'oldest':
      sql += " ORDER BY v.created_at ASC";
      break;
    case 'popular':
      sql += " ORDER BY v.view_count DESC";
      break;
    case 'rating':
      sql += " ORDER BY v.like_count DESC";
      break;
  }

  sql += " LIMIT ? OFFSET ?";
  bindings.push(limit, offset);

  const { results } = await c.env.DB.prepare(sql).bind(...bindings).all();

  // Get total count for pagination
  let countSql = "SELECT COUNT(*) as total FROM videos v LEFT JOIN categories c ON v.category_id = c.id WHERE 1=1";
  const countBindings: any[] = [];

  if (query) {
    countSql += " AND (v.title LIKE ? OR v.description LIKE ?)";
    countBindings.push(`%${query}%`, `%${query}%`);
  }
  if (category) {
    countSql += " AND c.slug = ?";
    countBindings.push(category);
  }
  if (quality) {
    countSql += " AND v.quality = ?";
    countBindings.push(quality);
  }
  if (duration_min) {
    countSql += " AND v.duration >= ?";
    countBindings.push(duration_min * 60);
  }
  if (duration_max) {
    countSql += " AND v.duration <= ?";
    countBindings.push(duration_max * 60);
  }

  const countResult = await c.env.DB.prepare(countSql).bind(...countBindings).first();
  const total = (countResult as any)?.total || 0;

  return c.json({
    videos: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

app.get("/api/videos/:id", async (c) => {
  const id = c.req.param("id");

  const video = await c.env.DB.prepare(`
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM videos v
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE v.id = ?
  `).bind(id).first();

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }

  return c.json(video);
});

// Categories endpoint
app.get("/api/categories", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM categories ORDER BY name ASC"
  ).all();

  return c.json(results);
});

// Favorites endpoints
app.get("/api/favorites", authMiddleware, async (c) => {
  const user = c.get("user");
  const { sort = 'newest' } = c.req.query();

  let orderBy = 'f.created_at DESC';
  switch (sort) {
    case 'oldest':
      orderBy = 'f.created_at ASC';
      break;
    case 'title':
      orderBy = 'v.title ASC';
      break;
    case 'duration':
      orderBy = 'v.duration DESC';
      break;
  }

  const { results } = await c.env.DB.prepare(`
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM favorites f
    JOIN videos v ON f.video_id = v.id
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE f.user_id = ?
    ORDER BY ${orderBy}
  `).bind(user!.id).all();

  return c.json({ videos: results });
});

app.post("/api/favorites", authMiddleware, async (c) => {
  const user = c.get("user");
  const { video_id } = await c.req.json();

  // Check if already favorited
  const existing = await c.env.DB.prepare(
    "SELECT id FROM favorites WHERE user_id = ? AND video_id = ?"
  ).bind(user!.id, video_id).first();

  if (existing) {
    return c.json({ error: "Video already in favorites" }, 400);
  }

  await c.env.DB.prepare(`
    INSERT INTO favorites (user_id, video_id, updated_at)
    VALUES (?, ?, datetime('now'))
  `).bind(user!.id, video_id).run();

  return c.json({ success: true }, 201);
});

app.delete("/api/favorites", authMiddleware, async (c) => {
  const user = c.get("user");
  const { video_id } = await c.req.json();

  await c.env.DB.prepare(
    "DELETE FROM favorites WHERE user_id = ? AND video_id = ?"
  ).bind(user!.id, video_id).run();

  return c.json({ success: true });
});

// User settings endpoints
app.get("/api/user-settings", authMiddleware, async (c) => {
  const user = c.get("user");

  const profile = await c.env.DB.prepare(
    "SELECT preferences, privacy_settings FROM user_profiles WHERE user_id = ?"
  ).bind(user!.id).first();

  const settings = {
    preferences: profile?.preferences ? JSON.parse(profile.preferences as string) : {},
    privacy_settings: profile?.privacy_settings ? JSON.parse(profile.privacy_settings as string) : {},
  };

  return c.json(settings);
});

app.put("/api/user-settings", authMiddleware, async (c) => {
  const user = c.get("user");
  const settings = await c.req.json();

  await c.env.DB.prepare(`
    UPDATE user_profiles
    SET preferences = ?, privacy_settings = ?, updated_at = datetime('now')
    WHERE user_id = ?
  `).bind(
    settings.preferences ? JSON.stringify(settings.preferences) : null,
    settings.privacy_settings ? JSON.stringify(settings.privacy_settings) : null,
    user!.id
  ).run();

  return c.json({ success: true });
});

// Analytics endpoints
app.get("/api/user-stats", authMiddleware, async (c) => {
  // const user = c.get("user");
  // const { range = 'month' } = c.req.query();

  // Mock data for demo
  const stats = {
    watchTime: Math.floor(Math.random() * 500) + 100,
    videosWatched: Math.floor(Math.random() * 50) + 10,
    favorites: Math.floor(Math.random() * 20) + 5,
    reviews: Math.floor(Math.random() * 10) + 2,
    subscriptions: 1,
    downloads: Math.floor(Math.random() * 15) + 3,
    achievements: Math.floor(Math.random() * 8) + 2,
    streak: Math.floor(Math.random() * 30) + 1,
  };

  return c.json(stats);
});

app.get("/api/user-activity", authMiddleware, async (c) => {
  // const user = c.get("user");
  const { limit = 10 } = c.req.query();

  // Mock activity data
  const activities = [
    { id: 1, type: 'watch', title: 'React Advanced Patterns', timestamp: new Date().toISOString(), duration: 45 },
    { id: 2, type: 'favorite', title: 'TypeScript Deep Dive', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, type: 'review', title: 'Node.js Best Practices', timestamp: new Date(Date.now() - 172800000).toISOString(), rating: 5 },
    { id: 4, type: 'share', title: 'CSS Grid Tutorial', timestamp: new Date(Date.now() - 259200000).toISOString() },
  ];

  return c.json(activities.slice(0, parseInt(limit.toString())));
});

app.get("/api/analytics", authMiddleware, async (c) => {
  // const user = c.get("user");
  // const { range = '30d' } = c.req.query();

  // Mock analytics data for creators/admins
  const analytics = {
    totalViews: Math.floor(Math.random() * 50000) + 10000,
    totalEngagement: Math.floor(Math.random() * 5000) + 1000,
    watchHours: Math.floor(Math.random() * 2000) + 500,
    uniqueViewers: Math.floor(Math.random() * 1000) + 200,
  };

  return c.json(analytics);
});

// Video Embeds endpoints
app.get("/api/video-embeds", async (c) => {
  const { q, category, tag, sort = 'newest' } = c.req.query();

  let sql = `
    SELECT ve.*, c.name as category_name, c.slug as category_slug
    FROM video_embeds ve
    LEFT JOIN categories c ON ve.category_id = c.id
    WHERE ve.is_approved = 1
  `;
  const bindings: any[] = [];

  if (q) {
    sql += " AND (ve.title LIKE ? OR ve.description LIKE ?)";
    bindings.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    sql += " AND c.slug = ?";
    bindings.push(category);
  }

  if (tag) {
    sql += " AND ve.tags LIKE ?";
    bindings.push(`%"${tag}"%`);
  }

  switch (sort) {
    case 'oldest':
      sql += " ORDER BY ve.created_at ASC";
      break;
    case 'popular':
      sql += " ORDER BY ve.view_count DESC";
      break;
    case 'title':
      sql += " ORDER BY ve.title ASC";
      break;
    default:
      sql += " ORDER BY ve.created_at DESC";
  }

  const { results } = await c.env.DB.prepare(sql).bind(...bindings).all();
  return c.json(results);
});

// External Links endpoints
app.get("/api/external-links", async (c) => {
  const { q, category, tag, sort = 'newest' } = c.req.query();

  let sql = `
    SELECT el.*, c.name as category_name, c.slug as category_slug
    FROM external_links el
    LEFT JOIN categories c ON el.category_id = c.id
    WHERE el.is_approved = 1
  `;
  const bindings: any[] = [];

  if (q) {
    sql += " AND (el.title LIKE ? OR el.description LIKE ?)";
    bindings.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    sql += " AND c.slug = ?";
    bindings.push(category);
  }

  if (tag) {
    sql += " AND el.tags LIKE ?";
    bindings.push(`%"${tag}"%`);
  }

  switch (sort) {
    case 'oldest':
      sql += " ORDER BY el.created_at ASC";
      break;
    case 'popular':
      sql += " ORDER BY el.click_count DESC";
      break;
    case 'title':
      sql += " ORDER BY el.title ASC";
      break;
    default:
      sql += " ORDER BY el.created_at DESC";
  }

  const { results } = await c.env.DB.prepare(sql).bind(...bindings).all();
  return c.json(results);
});

// Content Tags endpoints
app.get("/api/content-tags", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM content_tags ORDER BY usage_count DESC, name ASC"
  ).all();
  return c.json(results);
});

// Content Submissions endpoints
app.get("/api/content-submissions", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM content_submissions
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).bind(user!.id).all();

  return c.json(results);
});

app.post("/api/content-submissions", authMiddleware, async (c) => {
  const user = c.get("user");
  const data = await c.req.json();

  const result = await c.env.DB.prepare(`
    INSERT INTO content_submissions (
      user_id, submission_type, title, description, content_data,
      thumbnail_url, category_id, tags, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    user!.id,
    data.submission_type,
    data.title,
    data.description,
    data.content_data,
    data.thumbnail_url,
    data.category_id,
    data.tags
  ).run();

  const submission = await c.env.DB.prepare(
    "SELECT * FROM content_submissions WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(submission, 201);
});

// Admin Content Management endpoints
app.get("/api/admin/submissions", authMiddleware, async (c) => {
  const user = c.get("user");

  // Check if user is admin
  const isAdmin = user?.email === 'admin@streamflow.com' || user?.email?.includes('admin');
  if (!isAdmin) {
    return c.json({ error: "Admin access required" }, 403);
  }

  const { status = 'pending' } = c.req.query();

  const { results } = await c.env.DB.prepare(`
    SELECT cs.*, up.display_name as submitter_name, c.name as category_name
    FROM content_submissions cs
    LEFT JOIN user_profiles up ON cs.user_id = up.user_id
    LEFT JOIN categories c ON cs.category_id = c.id
    WHERE cs.status = ?
    ORDER BY cs.created_at DESC
  `).bind(status).all();

  return c.json(results);
});

app.put("/api/admin/submissions/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const submissionId = c.req.param("id");
  const { status, admin_notes } = await c.req.json();

  // Check if user is admin
  const isAdmin = user?.email === 'admin@streamflow.com' || user?.email?.includes('admin');
  if (!isAdmin) {
    return c.json({ error: "Admin access required" }, 403);
  }

  // Update submission
  await c.env.DB.prepare(`
    UPDATE content_submissions
    SET status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).bind(status, admin_notes, user!.id, submissionId).run();

  // If approved, create the actual content
  if (status === 'approved') {
    const submission = await c.env.DB.prepare(
      "SELECT * FROM content_submissions WHERE id = ?"
    ).bind(submissionId).first();

    if (submission) {
      const contentData = JSON.parse(submission.content_data as string);

      if (submission.submission_type === 'video_embed') {
        await c.env.DB.prepare(`
          INSERT INTO video_embeds (
            title, description, embed_code, thumbnail_url, duration,
            category_id, uploader_id, tags, is_approved, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
        `).bind(
          submission.title,
          submission.description,
          contentData.embed_code,
          submission.thumbnail_url,
          contentData.duration,
          submission.category_id,
          submission.user_id,
          submission.tags
        ).run();
      } else if (submission.submission_type === 'external_link') {
        await c.env.DB.prepare(`
          INSERT INTO external_links (
            title, description, url, thumbnail_url,
            category_id, uploader_id, tags, is_approved, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
        `).bind(
          submission.title,
          submission.description,
          contentData.url,
          submission.thumbnail_url,
          submission.category_id,
          submission.user_id,
          submission.tags
        ).run();
      }
    }
  }

  return c.json({ success: true });
});

// Analytics Recording endpoint
app.post("/api/analytics/record", async (c) => {
  const { content_type, content_id, action_type } = await c.req.json();

  // Record analytics
  await c.env.DB.prepare(`
    INSERT INTO content_analytics (content_type, content_id, action_type, updated_at)
    VALUES (?, ?, ?, datetime('now'))
  `).bind(content_type, content_id, action_type).run();

  // Update counters
  if (action_type === 'view' && content_type === 'embed') {
    await c.env.DB.prepare(
      "UPDATE video_embeds SET view_count = view_count + 1 WHERE id = ?"
    ).bind(content_id).run();
  } else if (action_type === 'click' && content_type === 'link') {
    await c.env.DB.prepare(
      "UPDATE external_links SET click_count = click_count + 1 WHERE id = ?"
    ).bind(content_id).run();
  }

  return c.json({ success: true });
});

// Reviews endpoints
app.post("/api/reviews", authMiddleware, zValidator("json", CreateReviewSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");

  // Check if user already reviewed this video
  const existing = await c.env.DB.prepare(
    "SELECT id FROM reviews WHERE user_id = ? AND video_id = ?"
  ).bind(user!.id, data.video_id).first();

  if (existing) {
    return c.json({ error: "You have already reviewed this video" }, 400);
  }

  const result = await c.env.DB.prepare(`
    INSERT INTO reviews (user_id, video_id, rating, comment, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).bind(
    user!.id,
    data.video_id,
    data.rating,
    data.comment || null
  ).run();

  const review = await c.env.DB.prepare(
    "SELECT * FROM reviews WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return c.json(review, 201);
});

app.get("/api/videos/:id/reviews", async (c) => {
  const videoId = c.req.param("id");

  const { results } = await c.env.DB.prepare(`
    SELECT r.*, up.display_name, up.avatar_url
    FROM reviews r
    LEFT JOIN user_profiles up ON r.user_id = up.user_id
    WHERE r.video_id = ?
    ORDER BY r.created_at DESC
  `).bind(videoId).all();

  return c.json(results);
});

export default app;
