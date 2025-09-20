
CREATE TABLE video_embeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  embed_code TEXT NOT NULL,
  thumbnail_url TEXT,
  source TEXT DEFAULT 'youtube',
  duration TEXT,
  tags TEXT,
  category_id INTEGER,
  uploader_id TEXT,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  is_approved BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE external_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id INTEGER,
  uploader_id TEXT,
  click_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  is_approved BOOLEAN DEFAULT 0,
  target_type TEXT DEFAULT '_blank',
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  submission_type TEXT NOT NULL, -- 'video_embed' or 'external_link'
  title TEXT NOT NULL,
  description TEXT,
  content_data TEXT NOT NULL, -- JSON with embed_code or url
  thumbnail_url TEXT,
  category_id INTEGER,
  tags TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL, -- 'video', 'embed', 'link'
  content_id INTEGER NOT NULL,
  user_id TEXT,
  action_type TEXT NOT NULL, -- 'view', 'click', 'share', 'like'
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
