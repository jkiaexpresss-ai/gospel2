import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { heroBooks } from './assets';
import BookCover from './BookCover';

export default function FinalCTA() {
  return (
    <section className="relative py-32 sm:py-40 overflow-hidden">
      {/* slow moving light */}
      <div
        className="absolute inset-0 pointer-events-none bk-cta-light"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(212,175,55,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* cross glowing in the distance */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 bk-cross-glow" aria-hidden="true">
        <div className="relative w-8 h-20">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-20 bg-gradient-to-b from-gold-300/80 to-transparent rounded-full" />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 w-8 h-1.5 bg-gradient-to-r from-transparent via-gold-300/80 to-transparent rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
        {/* three books standing together */}
        <div className="flex justify-center items-end gap-3 sm:gap-5 mb-12">
          {heroBooks.map((book, i) => (
            <div
              key={book.id}
              className="bk-float relative"
              style={{ ['--rot' as string]: `${(i - 1) * 3}deg`, animationDelay: `${i * 0.6}s` }}
            >
              <div
                className="absolute -inset-1 rounded-lg blur-md opacity-50 -z-10"
                style={{ background: book.accent }}
                aria-hidden="true"
              />
              <BookCover
                title={book.title}
                subtitle={book.subtitle}
                edition={book.age}
                accent={book.accent}
                width="w-20 sm:w-28"
                height="h-32 sm:h-44"
              />
            </div>
          ))}
        </div>

        <h2 className="font-cinzel text-4xl sm:text-6xl font-bold text-white leading-tight">
          One Bible.
          <br /> Three Versions. <br /> Every Age.
        </h2>
        <p className="mt-6 font-cinzel text-xl sm:text-2xl text-gold-300">
          Begin Your Journey Today
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/books#collections"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gold-400/40 text-gold-200 font-semibold hover:bg-gold-400/10 hover:border-gold-400/70 transition-all"
          >
            Explore the Collection <ArrowRight size={18} />
          </Link>
          <Link
            to="/books#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[#05070D] font-bold bk-shimmer shadow-[0_0_32px_rgba(212,175,55,0.4)] hover:shadow-[0_0_48px_rgba(212,175,55,0.6)] transition-all"
          >
            Shop Now <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
