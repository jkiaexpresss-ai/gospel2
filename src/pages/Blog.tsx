import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';
import { getSupabaseClient } from '@/lib/supabase';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
};

export default function Blog() {
  useSEO({
    title: 'Blog | In Him Daily',
    description: 'Articles, reflections, and devotionals from In Him Daily — deepening your walk with Christ and His Word.',
    canonicalPath: '/blog',
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await getSupabaseClient()
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (error) throw error;
        setPosts(data ?? []);
      } catch {
        setError('Articles could not be loaded. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  function formatDate(iso: string | null) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function readTime(content: string) {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,152,58,0.10) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <p className="ih-eyebrow mb-3">The Blog</p>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Articles &amp; Reflections
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Deepen your faith with articles on Scripture, family devotion, prayer, and the beauty of Christ on every page.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Search + Categories */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search articles"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-gold-400 transition-colors text-sm"
              />
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    !activeCategory ? 'bg-gold-500 text-[#05070D]' : 'bg-white/10 text-white/60 hover:bg-white/15'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activeCategory === cat ? 'bg-gold-500 text-[#05070D]' : 'bg-white/10 text-white/60 hover:bg-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/50">
              <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mr-3" />
              Loading articles...
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-white/50">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-playfair text-2xl text-white/70 mb-2">No articles yet</p>
              <p className="text-white/40 text-sm">Check back soon for new content.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && !search && !activeCategory && (
                <ScrollReveal className="mb-12">
                  <Link to={`/blog/${featured.slug}`} className="block group">
                    <div className="premium-card rounded-2xl overflow-hidden ih-card">
                      <div className="grid md:grid-cols-2">
                        <div className="relative h-56 md:h-64 overflow-hidden">
                          {featured.cover_image_url ? (
                            <img
                              src={featured.cover_image_url}
                              alt={featured.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-700 to-[#05070D]">
                              <Tag size={40} className="text-gold-400/30" aria-hidden="true" />
                            </div>
                          )}
                          {featured.category && (
                            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.68rem] font-bold bg-gold-500 text-[#05070D]">
                              {featured.category}
                            </span>
                          )}
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-3 text-white/40 text-xs mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} aria-hidden="true" />
                              {formatDate(featured.published_at ?? featured.created_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} aria-hidden="true" />
                              {readTime(featured.content)} min read
                            </span>
                          </div>
                          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-gold-200 transition-colors">
                            {featured.title}
                          </h2>
                          <p className="text-white/55 text-sm leading-relaxed mb-5 line-clamp-3">
                            {featured.excerpt ?? featured.content.slice(0, 180) + '...'}
                          </p>
                          <span className="inline-flex items-center gap-2 text-gold-300 text-sm font-semibold group-hover:text-gold-200 transition-colors">
                            Read article <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Grid of remaining posts */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featured && !search && !activeCategory ? rest : filtered).map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 80}>
                    <Link to={`/blog/${post.slug}`} className="block group h-full">
                      <article className="premium-card rounded-2xl overflow-hidden ih-card h-full flex flex-col">
                        <div className="relative h-44 overflow-hidden">
                          {post.cover_image_url ? (
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-700 to-[#05070D]">
                              <Tag size={32} className="text-gold-400/25" aria-hidden="true" />
                            </div>
                          )}
                          {post.category && (
                            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-gold-500/90 text-[#05070D]">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-white/40 text-[0.7rem] mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} aria-hidden="true" />
                              {formatDate(post.published_at ?? post.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} aria-hidden="true" />
                              {readTime(post.content)} min
                            </span>
                          </div>
                          <h3 className="font-playfair text-lg font-bold text-white mb-2 leading-snug group-hover:text-gold-200 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                            {post.excerpt ?? post.content.slice(0, 140) + '...'}
                          </p>
                          <span className="text-gold-300 text-xs font-semibold group-hover:text-gold-200 transition-colors">
                            Read more →
                          </span>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
