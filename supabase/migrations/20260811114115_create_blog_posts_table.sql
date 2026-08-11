/*
# Create blog_posts table

1. New Tables
- `blog_posts`
  - `id` (uuid, primary key)
  - `title` (text, not null) — article title
  - `slug` (text, unique, not null) — URL-friendly identifier for /blog/:slug routes
  - `excerpt` (text) — short summary shown on the blog listing page
  - `content` (text, not null) — full article body
  - `cover_image_url` (text) — optional hero image URL
  - `author` (text, default 'In Him Daily') — article author name
  - `category` (text) — e.g. "Devotionals", "Family", "Theology"
  - `status` (text, default 'draft') — 'draft' or 'published'
  - `published_at` (timestamptz) — when the article goes live
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now()) — auto-updated via trigger

2. Security
- Enable RLS on `blog_posts`.
- SELECT: anyone can read published posts; authenticated can read all posts including drafts.
- INSERT/UPDATE/DELETE: only authenticated users (admins) can manage posts.

3. Notes
- Public visitors see only published posts on the blog listing page.
- The admin page shows all posts and allows creating, editing, publishing, and deleting.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  author text NOT NULL DEFAULT 'In Him Daily',
  category text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_blog_posts" ON blog_posts;
CREATE POLICY "public_read_published_blog_posts"
ON blog_posts FOR SELECT
TO anon, authenticated
USING (status = 'published' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts"
ON blog_posts FOR DELETE
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx ON blog_posts (status, published_at DESC);
