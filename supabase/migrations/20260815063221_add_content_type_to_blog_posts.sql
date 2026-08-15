-- Add content_type column to blog_posts to distinguish between "blog" and "article"
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'article'
  CHECK (content_type IN ('blog', 'article'));

-- Backfill existing rows
UPDATE blog_posts SET content_type = 'article' WHERE content_type IS NULL;

-- Add index for filtering by content type
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_type ON blog_posts (content_type);
