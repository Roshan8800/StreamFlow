
DELETE FROM external_links WHERE uploader_id = 'admin';
DELETE FROM video_embeds WHERE uploader_id = 'admin';
DELETE FROM content_tags WHERE slug IN ('tutorial', 'review', 'beginner', 'advanced', 'tips', 'guide', 'demo', 'interview', 'news', 'analysis');
DELETE FROM categories WHERE slug IN ('technology', 'education', 'entertainment', 'gaming', 'music', 'sports', 'health-fitness', 'travel', 'food-cooking', 'science');
