import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  title: string;
  subtitle?: string;
  edition?: string;
  accent: string;
  volume?: string;
  width?: string;
  height?: string;
  className?: string;
}

/**
 * CSS-rendered book cover — replaces broken PNG files that were truncated
 * at 512KB. Renders a premium devotional cover with title, edition, and
 * In Him Daily branding so the cover always displays fully.
 */
export default function BookCover({
  title,
  subtitle,
  edition,
  accent,
  volume,
  width = 'w-28',
  height = 'h-44',
  className = '',
}: BookCoverProps) {
  return (
    <div
      className={`relative ${width} ${height} rounded-lg overflow-hidden shadow-xl border border-white/10 ${className}`}
      style={{
        background: `linear-gradient(160deg, ${accent}22 0%, #0a0e1a 50%, ${accent}11 100%)`,
      }}
    >
      {/* spine */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)`,
        }}
      />

      {/* decorative border */}
      <div
        className="absolute inset-2 rounded border pointer-events-none"
        style={{ borderColor: `${accent}40` }}
      />

      {/* content */}
      <div className="relative h-full flex flex-col items-center justify-between p-3 pl-4 text-center">
        {/* top branding */}
        <div className="flex flex-col items-center gap-1">
          <BookOpen size={16} style={{ color: accent }} />
          <p
            className="font-cinzel text-[7px] sm:text-[8px] tracking-[0.2em] uppercase"
            style={{ color: `${accent}cc` }}
          >
            In Him Daily
          </p>
        </div>

        {/* main title */}
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          {volume && (
            <p
              className="font-cinzel text-[7px] sm:text-[8px] tracking-[0.15em] uppercase mb-1.5"
              style={{ color: `${accent}99` }}
            >
              {volume}
            </p>
          )}
          <h3 className="font-cinzel text-white text-xs sm:text-sm lg:text-base font-bold leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1.5 text-white/60 text-[8px] sm:text-[9px] lg:text-[10px] leading-snug">
              {subtitle}
            </p>
          )}
        </div>

        {/* edition badge */}
        {edition && (
          <div
            className="px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-cinzel tracking-wider uppercase"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}55`,
            }}
          >
            {edition}
          </div>
        )}
      </div>
    </div>
  );
}
