import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
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

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({
    title: post?.title ?? 'Article | In Him Daily',
    description: post?.excerpt ?? 'Read this article from In Him Daily.',
    canonicalPath: `/blog/${slug ?? ''}`,
    ogImage: post?.cover_image_url ?? undefined,
    ogType: 'article',
  });

  useEffect(() => {
    async function load() {
      if (!slug) {
        setError('Article not found.');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await getSupabaseClient()
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setError('Article not found.');
          setLoading(false);
          return;
        }
        setPost(data);
      } catch {
        setError('Article could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function formatDate(iso: string | null) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function readTime(content: string) {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <h1 className="font-playfair text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white/50 mb-8">{error ?? 'The article you are looking for does not exist or has been removed.'}</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 ih-btn-gold text-sm">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,152,58,0.10) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <Link to="/blog" className="inline-flex items-center gap-2 text-gold-300 text-sm font-medium hover:text-gold-200 transition-colors mb-6">
              <ArrowLeft size={15} aria-hidden="true" /> All Articles
            </Link>
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full text-[0.68rem] font-bold bg-gold-500/15 text-gold-300 border border-gold-400/30 mb-5">
                {post.category}
              </span>
            )}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" />
                {formatDate(post.published_at ?? post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" />
                {readTime(post.content)} min read
              </span>
              <span className="text-white/40">by {post.author}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <ScrollReveal>
            <div className="relative h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden ih-card">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Article content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            {post.excerpt && (
              <p className="font-cormorant text-xl text-gold-200 italic leading-relaxed mb-8 pb-8 border-b border-white/10">
                {post.excerpt}
              </p>
            )}
            <div className="prose-blog">
              {post.content.split('\n').map((paragraph, i) => {
                if (paragraph.trim() === '') return null;
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="font-playfair text-2xl font-bold text-white mt-8 mb-4">{paragraph.slice(3)}</h2>;
                }
                if (paragraph.startsWith('# ')) {
                  return <h2 key={i} className="font-playfair text-2xl font-bold text-white mt-8 mb-4">{paragraph.slice(2)}</h2>;
                }
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  return (
                    <p key={i} className="text-white/70 leading-relaxed mb-4 pl-4">
                      <span className="text-gold-400 mr-2">•</span>
                      {paragraph.slice(2)}
                    </p>
                  );
                }
                return <p key={i} className="text-white/70 leading-relaxed mb-5">{paragraph}</p>;
              })}
            </div>
          </ScrollReveal>

          {/* Share + back */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/blog" className="inline-flex items-center gap-2 text-gold-300 text-sm font-semibold hover:text-gold-200 transition-colors">
              <ArrowLeft size={15} aria-hidden="true" /> Back to all articles
            </Link>
            <Link to="/devotionals" className="inline-flex items-center gap-2 text-gold-300 text-sm font-semibold hover:text-gold-200 transition-colors">
              Explore devotionals <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
