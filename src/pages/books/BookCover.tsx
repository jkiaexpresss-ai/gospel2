interface BookCoverProps {
  title: string;
  subtitle?: string;
  edition?: string;
  accent: string;
  volume?: string;
  cover?: string;
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Renders a real book cover image when `cover` is provided, falling back to
 * a CSS-rendered cover when no image is available.
 */
export default function BookCover({
  title,
  subtitle,
  edition,
  accent,
  volume,
  cover,
  width = 'w-28',
  height = 'h-44',
  className = '',
}: BookCoverProps) {
  if (cover) {
    return (
      <div
        className={`relative ${width} ${height} rounded-lg overflow-hidden shadow-xl border border-white/10 ${className}`}
      >
        <img
          src={cover}
          alt={`${title}${edition ? ` — ${edition} Edition` : ''}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {edition && (
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
            <p className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-center text-white/90">
              {edition}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative ${width} ${height} rounded-lg overflow-hidden shadow-xl border border-white/10 ${className}`}
      style={{
        background: `linear-gradient(160deg, ${accent}22 0%, #0a0e1a 50%, ${accent}11 100%)`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)` }}
      />
      <div
        className="absolute inset-2 rounded border pointer-events-none"
        style={{ borderColor: `${accent}40` }}
      />
      <div className="relative h-full flex flex-col items-center justify-between p-3 pl-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <p className="font-cinzel text-[7px] sm:text-[8px] tracking-[0.2em] uppercase" style={{ color: `${accent}cc` }}>
            In Him Daily
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          {volume && (
            <p className="font-cinzel text-[7px] sm:text-[8px] tracking-[0.15em] uppercase mb-1.5" style={{ color: `${accent}99` }}>
              {volume}
            </p>
          )}
          <h3 className="font-cinzel text-white text-xs sm:text-sm lg:text-base font-bold leading-tight">{title}</h3>
          {subtitle && <p className="mt-1.5 text-white/60 text-[8px] sm:text-[9px] lg:text-[10px] leading-snug">{subtitle}</p>}
        </div>
        {edition && (
          <div
            className="px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-cinzel tracking-wider uppercase"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}
          >
            {edition}
          </div>
        )}
      </div>
    </div>
  );
}
