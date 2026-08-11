import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BackgroundDecoration from '@/components/BackgroundDecoration';
import Home from './pages/Home';

const About            = lazy(() => import('./pages/About'));
const Admin            = lazy(() => import('./pages/Admin'));
const AdminLogin       = lazy(() => import('./pages/AdminLogin'));
const Contact          = lazy(() => import('./pages/Contact'));
const Devotionals      = lazy(() => import('./pages/Devotionals'));
const FreeSample       = lazy(() => import('./pages/FreeSample'));
const PrayerGuidelines = lazy(() => import('./pages/PrayerGuidelines'));
const PrayerPartners   = lazy(() => import('./pages/PrayerPartners'));
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'));
const Communities      = lazy(() => import('./pages/Communities'));
const Books            = lazy(() => import('./pages/Books'));
const Donate           = lazy(() => import('./pages/Donate'));
const SampleContent    = lazy(() => import('./pages/SampleContent'));
const Blog             = lazy(() => import('./pages/Blog'));
const BlogArticle      = lazy(() => import('./pages/BlogArticle'));
const NotFound         = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundDecoration />
      <Navigation />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devotionals" element={<Devotionals />} />
            <Route path="/free-sample" element={<FreeSample />} />
            <Route path="/prayer-guidelines" element={<PrayerGuidelines />} />
            <Route path="/prayer-partners" element={<PrayerPartners />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/books" element={<Books />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/sample-content" element={<SampleContent />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
