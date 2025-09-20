
-- Seed sample categories for the directory
INSERT INTO categories (name, slug, description, updated_at) VALUES
('Technology', 'technology', 'Latest tech tutorials, reviews, and news', datetime('now')),
('Education', 'education', 'Educational content and learning resources', datetime('now')),
('Entertainment', 'entertainment', 'Movies, shows, and entertainment content', datetime('now')),
('Gaming', 'gaming', 'Gaming videos, reviews, and livestreams', datetime('now')),
('Music', 'music', 'Music videos, tutorials, and performances', datetime('now')),
('Sports', 'sports', 'Sports highlights, analysis, and training', datetime('now')),
('Health & Fitness', 'health-fitness', 'Workout routines, health tips, and wellness', datetime('now')),
('Travel', 'travel', 'Travel vlogs, guides, and destination reviews', datetime('now')),
('Food & Cooking', 'food-cooking', 'Recipes, cooking tutorials, and food reviews', datetime('now')),
('Science', 'science', 'Scientific content, experiments, and discoveries', datetime('now'));

-- Seed sample content tags
INSERT INTO content_tags (name, slug, usage_count, created_at) VALUES
('tutorial', 'tutorial', 15, datetime('now')),
('review', 'review', 12, datetime('now')),
('beginner', 'beginner', 8, datetime('now')),
('advanced', 'advanced', 6, datetime('now')),
('tips', 'tips', 10, datetime('now')),
('guide', 'guide', 9, datetime('now')),
('demo', 'demo', 7, datetime('now')),
('interview', 'interview', 5, datetime('now')),
('news', 'news', 11, datetime('now')),
('analysis', 'analysis', 4, datetime('now'));

-- Seed sample video embeds (approved content)
INSERT INTO video_embeds (title, description, embed_code, thumbnail_url, duration, category_id, uploader_id, tags, view_count, is_featured, is_approved, updated_at) VALUES
(
  'Introduction to React Hooks',
  'Learn the basics of React Hooks including useState, useEffect, and custom hooks in this comprehensive tutorial.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dGcsHMXbSOA" frameborder="0" allowfullscreen></iframe>',
  'https://img.youtube.com/vi/dGcsHMXbSOA/maxresdefault.jpg',
  '25:30',
  1,
  'admin',
  '["tutorial", "beginner", "react"]',
  1250,
  1,
  1,
  datetime('now')
),
(
  'JavaScript ES6 Features Explained',
  'Comprehensive guide to modern JavaScript ES6 features including arrow functions, destructuring, and modules.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/WZQc7RUAg18" frameborder="0" allowfullscreen></iframe>',
  'https://img.youtube.com/vi/WZQc7RUAg18/maxresdefault.jpg',
  '18:45',
  1,
  'admin',
  '["tutorial", "javascript", "es6"]',
  980,
  0,
  1,
  datetime('now')
),
(
  'TypeScript for Beginners',
  'Start your TypeScript journey with this beginner-friendly tutorial covering types, interfaces, and basic concepts.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/BwuLxPH8IDs" frameborder="0" allowfullscreen></iframe>',
  'https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg',
  '32:15',
  1,
  'admin',
  '["tutorial", "beginner", "typescript"]',
  2100,
  1,
  1,
  datetime('now')
);

-- Seed sample external links (approved content)
INSERT INTO external_links (title, description, url, thumbnail_url, category_id, uploader_id, tags, click_count, is_featured, is_approved, updated_at) VALUES
(
  'MDN Web Docs - JavaScript Guide',
  'The comprehensive JavaScript documentation and tutorial resource from Mozilla Developer Network.',
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
  1,
  'admin',
  '["documentation", "javascript", "reference"]',
  450,
  1,
  1,
  datetime('now')
),
(
  'React Official Documentation',
  'Official React documentation with guides, API reference, and best practices for building user interfaces.',
  'https://react.dev/',
  'https://react.dev/images/og-home.png',
  1,
  'admin',
  '["documentation", "react", "guide"]',
  680,
  1,
  1,
  datetime('now')
),
(
  'Khan Academy - Computer Programming',
  'Free online courses for learning computer programming, including JavaScript, HTML/CSS, and SQL.',
  'https://www.khanacademy.org/computing/computer-programming',
  'https://cdn.kastatic.org/ka-perseus-images/cc207c41d06e42e0a3b68e0eb1b5d7e17dca7e4c.png',
  2,
  'admin',
  '["education", "programming", "courses"]',
  320,
  0,
  1,
  datetime('now')
),
(
  'GitHub - The Complete Guide',
  'Comprehensive tutorial website for learning Git and GitHub for version control and collaboration.',
  'https://github.com/git-guides',
  'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
  1,
  'admin',
  '["guide", "git", "github", "tools"]',
  275,
  0,
  1,
  datetime('now')
);
