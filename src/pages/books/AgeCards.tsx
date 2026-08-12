import { Baby, Sparkles, BookText, Users } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { ageCards } from './assets';
import BookCover from './BookCover';

const icons = [Baby, Sparkles, BookText, Users];

export default function AgeCards() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 01</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            One Message. <span className="text-white/60">Every Age.</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Designed for every stage of life — the same unchanging story, told in a voice each
            generation can understand.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ageCards.map((card, i) => {
            const Icon = icons[i] ?? Baby;
            return (
              <ScrollReveal key={card.id} delay={i * 120}>
                <div className="bk-glass rounded-2xl p-8 h-full group transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-[0_20px_60px_rgba(212,175,55,0.18)]">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.12)',
                        boxShadow: '0 0 24px rgba(212,175,55,0.2)',
                      }}
                    >
                      <Icon className="text-gold-300" size={26} />
                    </div>
                    <span className="font-cinzel text-xs tracking-[0.2em] text-white/40">
                      {card.range}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl font-semibold text-white mb-5">
                    {card.age}
                  </h3>

                  <ul className="space-y-3">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden" style={{ height: 440 }}>
                    <BookCover
                      title="In the Beginning, He Was There"
                      subtitle={card.range}
                      edition={card.age}
                      accent={i === 0 ? '#F59E0B' : i === 1 ? '#3B82F6' : '#D4AF37'}
                      cover={card.cover}
                      width="w-44"
                      height="h-64"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
