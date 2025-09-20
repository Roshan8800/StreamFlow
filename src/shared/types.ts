import z from "zod";

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  display_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  preferences: z.string().nullable(),
  privacy_settings: z.string().nullable(),
  subscription_tier: z.string().default('free'),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Video Schema
export const VideoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  video_url: z.string().nullable(),
  duration: z.number().nullable(),
  file_size: z.number().nullable(),
  quality: z.string().default('HD'),
  category_id: z.number().nullable(),
  uploader_id: z.string().nullable(),
  view_count: z.number().default(0),
  like_count: z.number().default(0),
  is_premium: z.number().default(0),
  tags: z.string().nullable(),
  metadata: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Video = z.infer<typeof VideoSchema>;

// Category Schema
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parent_id: z.number().nullable(),
  icon_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

// Viewing History Schema
export const ViewingHistorySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  video_id: z.number(),
  watch_duration: z.number().default(0),
  progress: z.number().default(0),
  last_watched_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ViewingHistory = z.infer<typeof ViewingHistorySchema>;

// Review Schema
export const ReviewSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  video_id: z.number(),
  rating: z.number().nullable(),
  comment: z.string().nullable(),
  is_verified: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;

// API Request/Response Schemas
export const CreateProfileSchema = z.object({
  display_name: z.string().optional(),
  bio: z.string().optional(),
  preferences: z.record(z.any()).optional(),
  privacy_settings: z.record(z.any()).optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export const CreateReviewSchema = z.object({
  video_id: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const SearchVideosSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  quality: z.string().optional(),
  duration_min: z.number().optional(),
  duration_max: z.number().optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'rating']).default('newest'),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type SearchVideosParams = z.infer<typeof SearchVideosSchema>;
