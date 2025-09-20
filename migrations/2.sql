
-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Latest tech reviews, tutorials, and innovations'),
('Gaming', 'gaming', 'Game reviews, playthroughs, and gaming news'),
('Music', 'music', 'Music videos, performances, and artist interviews'),
('Education', 'education', 'Educational content, tutorials, and learning materials'),
('Entertainment', 'entertainment', 'Movies, TV shows, and general entertainment'),
('Sports', 'sports', 'Sports highlights, analysis, and coverage'),
('News', 'news', 'Latest news and current events'),
('Travel', 'travel', 'Travel vlogs, guides, and destination reviews');

-- Insert sample videos
INSERT INTO videos (title, description, thumbnail_url, duration, quality, category_id, view_count, like_count, tags, created_at) VALUES
('Introduction to React Hooks', 'Learn the fundamentals of React Hooks in this comprehensive tutorial covering useState, useEffect, and custom hooks.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop', 1800, 'HD', 1, 15420, 842, '["react", "hooks", "javascript", "tutorial"]', datetime('now', '-5 days')),

('Epic Gaming Montage 2024', 'Best gaming moments compilation featuring incredible plays from popular games like Valorant, CS2, and Apex Legends.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop', 420, 'HD', 2, 89340, 3241, '["gaming", "montage", "valorant", "cs2"]', datetime('now', '-3 days')),

('Acoustic Guitar Session', 'Relaxing acoustic guitar performance featuring original compositions and popular covers in a cozy studio setting.', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop', 2400, 'HD', 3, 23100, 1205, '["music", "acoustic", "guitar", "live"]', datetime('now', '-7 days')),

('Python for Beginners', 'Complete Python programming course for absolute beginners. Learn variables, functions, loops, and basic programming concepts.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop', 3600, 'HD', 4, 45670, 2134, '["python", "programming", "beginner", "tutorial"]', datetime('now', '-2 days')),

('Top 10 Movies of 2024', 'Comprehensive review of the best movies released this year, featuring analysis of plot, cinematography, and performances.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop', 1260, 'HD', 5, 67890, 2876, '["movies", "review", "2024", "top10"]', datetime('now', '-1 day')),

('Championship Finals Highlights', 'Best moments from the championship finals including incredible goals, saves, and game-changing plays.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop', 900, 'HD', 6, 123450, 5432, '["sports", "finals", "highlights", "championship"]', datetime('now', '-4 days')),

('Tech News Weekly', 'This weeks biggest tech stories including new product launches, industry updates, and breakthrough innovations.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', 1500, 'HD', 7, 34210, 1876, '["tech", "news", "weekly", "innovation"]', datetime('now', '-6 days')),

('Tokyo Travel Guide', 'Complete guide to visiting Tokyo featuring must-see attractions, local food recommendations, and cultural insights.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop', 2100, 'HD', 8, 78900, 4123, '["travel", "tokyo", "japan", "guide"]', datetime('now', '-8 days'));

-- Insert subscription plans
INSERT INTO subscription_plans (name, price, billing_period, features) VALUES
('Free', 0.00, 'monthly', '["Limited video access", "Standard quality", "Basic recommendations"]'),
('Premium', 9.99, 'monthly', '["Unlimited video access", "HD quality", "Advanced AI recommendations", "Ad-free experience", "Early access to new content"]'),
('Premium Annual', 99.99, 'yearly', '["Unlimited video access", "HD quality", "Advanced AI recommendations", "Ad-free experience", "Early access to new content", "2 months free"]');
