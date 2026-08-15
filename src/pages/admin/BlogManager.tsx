import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader as Loader2, Save, CircleCheck as CheckCircle2 } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string | null;
  content_type: 'blog' | 'article' | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author: string;
  category: string;
  content_type: 'blog' | 'article';
  status: 'draft' | 'published';
};

const EMPTY_FORM: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author: 'In Him Daily',
  category: '',
  content_type: 'article',
  status: 'draft',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogManager({ posts, onRefresh }: { posts: BlogPost[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setShowForm(true);
    setMessage('');
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content,
      cover_image_url: post.cover_image_url ?? '',
      author: post.author,
      category: post.category ?? '',
      content_type: (post.content_type as 'blog' | 'article') ?? 'article',
      status: post.status as 'draft' | 'published',
    });
    setEditingId(post.id);
    setSlugManuallyEdited(true);
    setShowForm(true);
    setMessage('');
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage('Title and content are required.');
      return;
    }

    const slug = form.slug.trim() || slugify(form.title);
    if (!slug) {
      setMessage('Could not generate a valid slug.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const supabase = getSupabaseClient();
      const payload = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        cover_image_url: form.cover_image_url.trim() || null,
        author: form.author.trim() || 'In Him Daily',
        category: form.category.trim() || null,
        content_type: form.content_type,
        status: form.status,
        published_at: form.status === 'published' && !editingId ? new Date().toISOString() : undefined,
      };

      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingId);
        if (error) throw error;
        setMessage('Article updated successfully.');
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload);
        if (error) throw error;
        setMessage('Article created successfully.');
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      onRefresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save article.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post: BlogPost) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const supabase = getSupabaseClient();
      const payload: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'published' && !post.published_at) {
        payload.published_at = new Date().toISOString();
      }
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
      if (error) throw error;
      onRefresh();
    } catch {
      setMessage('Could not update article status.');
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('blog_posts').delete().eq('id', deleteId);
      if (error) throw error;
      setDeleteId(null);
      onRefresh();
    } catch {
      setMessage('Could not delete article.');
    }
  }

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-xl font-bold text-white">
            {editingId ? `Edit ${form.content_type === 'blog' ? 'Blog Post' : 'Article'}` : `New ${form.content_type === 'blog' ? 'Blog Post' : 'Article'}`}
          </h3>
          <button
            onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close form"
          >
            <X size={18} className="text-white" aria-hidden="true" />
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const newSlug = slugManuallyEdited ? form.slug : slugify(e.target.value);
                  setForm({ ...form, title: e.target.value, slug: newSlug });
                }}
                placeholder="Article title"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                placeholder="article-url-slug"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Type</label>
              <select
                value={form.content_type}
                onChange={(e) => setForm({ ...form, content_type: e.target.value as 'blog' | 'article' })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
              >
                <option value="article" className="bg-[#05070D]">Article</option>
                <option value="blog" className="bg-[#05070D]">Blog Post</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Devotionals"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="In Him Daily"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
              >
                <option value="draft" className="bg-[#05070D]">Draft</option>
                <option value="published" className="bg-[#05070D]">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Cover Image URL (optional)</label>
            <input
              type="text"
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              placeholder="https://images.pexels.com/..."
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Excerpt (short summary)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A brief summary shown on the blog listing page..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the full article here. Use blank lines to separate paragraphs. Start a line with # for a heading."
              rows={14}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm resize-y font-mono leading-relaxed"
            />
            <p className="text-[0.68rem] text-white/35 mt-1.5">Tip: Use # for headings, blank lines between paragraphs, and - for bullet points.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 ih-btn-gold text-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {editingId ? `Update ${form.content_type === 'blog' ? 'Blog Post' : 'Article'}` : `Create ${form.content_type === 'blog' ? 'Blog Post' : 'Article'}`}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-playfair text-xl font-bold text-white">
          Blog Articles {posts.length > 0 && <span className="text-white/40 text-base">({posts.length})</span>}
        </h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 ih-btn-gold text-sm"
        >
          <Plus size={16} aria-hidden="true" /> New Post
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-200">
          <CheckCircle2 size={16} aria-hidden="true" /> {message}
        </div>
      )}

      {deleteId && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4">
          <p className="text-sm text-red-200">Delete this article permanently? This cannot be undone.</p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg text-sm text-white font-medium transition-colors">
              Delete
            </button>
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40 text-sm mb-4">No articles yet. Create your first blog post.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 ih-btn-gold text-sm">
            <Plus size={16} aria-hidden="true" /> New Article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-gold-400/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border ${
                      post.status === 'published'
                        ? 'bg-green-500/15 text-green-300 border-green-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {post.status}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border ${
                      (post.content_type ?? 'article') === 'blog'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    }`}>
                      {(post.content_type ?? 'article') === 'blog' ? 'Blog' : 'Article'}
                    </span>
                    {post.category && (
                      <span className="text-[0.65rem] text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-playfair text-base font-semibold text-white truncate">{post.title}</h4>
                  <p className="text-white/40 text-xs mt-1">
                    /blog/{post.slug} · by {post.author} · updated {fmt(post.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => togglePublish(post)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={post.status === 'published' ? 'Unpublish' : 'Publish'}
                    title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {post.status === 'published'
                      ? <EyeOff size={15} className="text-white/60" aria-hidden="true" />
                      : <Eye size={15} className="text-green-300" aria-hidden="true" />}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Edit article"
                    title="Edit"
                  >
                    <Pencil size={15} className="text-white/60" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setDeleteId(post.id)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors"
                    aria-label="Delete article"
                    title="Delete"
                  >
                    <Trash2 size={15} className="text-white/60" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
