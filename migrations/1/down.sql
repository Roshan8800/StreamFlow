
-- Drop indexes
DROP INDEX idx_reviews_video_id;
DROP INDEX idx_reviews_user_id;
DROP INDEX idx_favorites_video_id;
DROP INDEX idx_favorites_user_id;
DROP INDEX idx_viewing_history_video_id;
DROP INDEX idx_viewing_history_user_id;
DROP INDEX idx_videos_uploader_id;
DROP INDEX idx_videos_category_id;
DROP INDEX idx_user_profiles_user_id;

-- Drop tables
DROP TABLE subscription_plans;
DROP TABLE reviews;
DROP TABLE favorites;
DROP TABLE viewing_history;
DROP TABLE categories;
DROP TABLE videos;
DROP TABLE user_profiles;
