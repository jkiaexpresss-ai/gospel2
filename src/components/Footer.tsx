import { Link } from 'react-router-dom';
import { Mail, Heart, Youtube, Facebook, Instagram } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/devotionals', label: 'Devotionals' },
  { href: '/blog', label: 'Blog' },
  { href: '/free-sample', label: 'Free Sample' },
  { href: '/prayer-partners', label: 'Prayer Partners' },
  { href: '/communities', label: 'Communities' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

const resourceLinks = [
  { href: '/free-sample', label: 'Adult Edition' },
  { href: '/free-sample', label: 'Teen Edition' },
  { href: '/free-sample', label: "Children's Edition" },
  { href: '/prayer-guidelines', label: 'Prayer Guidelines' },
  { href: '/devotionals', label: 'Series Library' },
  { href: '/blog', label: 'Blog Articles' },
  { href: '/communities', label: 'Communities' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-[#05070D] text-white border-t border-white/10" aria-label="Site footer">
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <p className="font-cormorant text-2xl md:text-[1.75rem] text-gold-200 italic leading-relaxed">
            &ldquo;The Word became flesh and made His dwelling among us.&rdquo;
          </p>
          <p className="mt-3 text-gold-500 text-xs font-semibold tracking-[0.18em] uppercase">
            John 1:14
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-4 mb-6 group" aria-label="In Him Daily home">
              <div className="relative w-16 h-16 flex-shrink-0 drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/images/ChatGPT_Image_Jun_12,_2026,_11_01_49_PM.png"
                  alt="In Him Daily logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-playfair text-xl font-bold leading-none">
                  In Him <em className="not-italic text-gold-400">Daily</em>
                </p>
                <p className="text-[0.65rem] text-white/50 tracking-[0.15em] uppercase mt-1">
                  Hidden with Christ in God
                </p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-[340px]">
              Daily devotionals for the whole family — rooted in the finished work of Christ. <em className="not-italic text-gold-300">&ldquo;For you died, and your life is now hidden with Christ in God.&rdquo;</em> — Colossians 3:3
            </p>
            <a
              href="mailto:hello@inhimdaily.org"
              className="inline-flex items-center gap-2 mt-5 text-sm text-white/50 hover:text-gold-300 transition-colors"
            >
              <Mail size={13} aria-hidden="true" />
              hello@inhimdaily.org
            </a>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://www.youtube.com/channel/UCXbhOCzUufGVQ6n5amOf3GQ" target="_blank" rel="noopener noreferrer" aria-label="Follow In Him Daily on YouTube"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#FF0000]/20 border border-white/15 hover:border-[#FF0000]/40 flex items-center justify-center text-white/60 hover:text-[#FF0000] transition-all duration-300 hover:-translate-y-0.5">
                <Youtube size={15} aria-hidden="true" />
              </a>
              <a href="https://www.facebook.com/people/Inhimdaily/61591293759943/" target="_blank" rel="noopener noreferrer" aria-label="Follow In Him Daily on Facebook"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#1877F2]/20 border border-white/15 hover:border-[#1877F2]/40 flex items-center justify-center text-white/60 hover:text-[#1877F2] transition-all duration-300 hover:-translate-y-0.5">
                <Facebook size={15} aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/inhimdailyministries/" target="_blank" rel="noopener noreferrer" aria-label="Follow In Him Daily on Instagram"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#E1306C]/20 border border-white/15 hover:border-[#E1306C]/40 flex items-center justify-center text-white/60 hover:text-[#E1306C] transition-all duration-300 hover:-translate-y-0.5">
                <Instagram size={15} aria-hidden="true" />
              </a>
              <Link to="/communities" aria-label="View all WhatsApp communities"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#25D366]/20 border border-white/15 hover:border-[#25D366]/40 flex items-center justify-center text-white/60 hover:text-[#25D366] transition-all duration-300 hover:-translate-y-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xs font-semibold text-gold-400 tracking-[0.14em] uppercase mb-5">
              Navigate
            </h3>
            <ul className="space-y-2.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/55 hover:text-gold-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-xs font-semibold text-gold-400 tracking-[0.14em] uppercase mb-5">
              Resources
            </h3>
            <ul className="space-y-2.5" role="list">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-white/55 hover:text-gold-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} In Him Daily. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-white/35 hover:text-gold-300 transition-colors">Privacy Policy</Link>
            <p className="text-xs text-white/35 flex items-center gap-1.5">
              Made with <Heart size={11} className="text-gold-500 fill-gold-500" aria-hidden="true" /> for families everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
