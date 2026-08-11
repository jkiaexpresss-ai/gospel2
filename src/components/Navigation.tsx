import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/',               label: 'Home' },
  { href: '/about',          label: 'About' },
  { href: '/devotionals',    label: 'Devotionals' },
  { href: '/blog',           label: 'Blog' },
  { href: '/books',          label: 'Books' },
  { href: '/free-sample',    label: 'Free Sample' },
  { href: '/prayer-partners',label: 'Prayer Partners' },
  { href: '/communities',    label: 'Communities' },
  { href: '/donate',         label: 'Donate' },
  { href: '/contact',        label: 'Contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location                    = useLocation();
  const pathname                    = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        scrolled ? 'glass-nav py-2 shadow-glass' : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="In Him Daily — home">
            <div className={`relative flex-shrink-0 transition-all duration-400 ${scrolled ? 'w-11 h-11' : 'w-14 h-14'}`}>
              <img
                src="/images/733127106_122096833941384062_9064072413288732878_n.jpg"
                alt="In Him Daily logo"
                className="w-full h-full object-contain drop-shadow group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className={`font-playfair font-bold transition-all duration-400 ${scrolled ? 'text-white text-base' : 'text-white text-[1.1rem]'}`}>
                In Him <em className="not-italic text-gold-400">Daily</em>
              </p>
              <p className={`text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-400 ${scrolled ? 'text-gold-300/70' : 'text-white/60'}`}>
                Hidden with Christ in God
              </p>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3.5 py-2 text-[0.82rem] font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-gold-300 bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex">
            <Link
              to="/free-sample"
              className={`px-5 py-2.5 text-[0.82rem] font-semibold rounded-full transition-all duration-300 ${
                'bg-gold-500 text-[#05070D] hover:bg-gold-400 shadow-gold'
              } hover:-translate-y-px`}
            >
              Get Free Sample
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="glass-nav border-t border-gold-100/20 px-4 pb-5 pt-3 space-y-0.5"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                pathname === link.href
                  ? 'text-gold-300 bg-white/10 font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              to="/free-sample"
              className="block text-center px-5 py-3 bg-gold-500 text-[#05070D] text-sm font-semibold rounded-full hover:bg-gold-400 transition-colors"
            >
              Get Free Sample
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
