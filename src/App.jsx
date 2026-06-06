import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ConsentProvider } from '@/contexts/ConsentContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const HorsesForSale = lazy(() => import('@/pages/HorsesForSale'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Contact = lazy(() => import('@/pages/Contact'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const Success = lazy(() => import('@/pages/Success'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const PrivacyTermsPage = lazy(() => import('@/pages/PrivacyTermsPage'));
const TermsAndPoliciesPage = lazy(() => import('@/pages/TermsAndPoliciesPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const CookiesPage = lazy(() => import('@/pages/CookiesPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminSignupPage = lazy(() => import('@/pages/admin/AdminSignupPage'));
const AdminPasswordResetPage = lazy(() => import('@/pages/admin/AdminPasswordResetPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminBlogList = lazy(() => import('@/pages/admin/AdminBlogList'));
const AdminBlogEditor = lazy(() => import('@/pages/admin/AdminBlogEditor'));
const AdminHomeImages = lazy(() => import('@/pages/admin/AdminHomeImages'));
const AdminHomeVideos = lazy(() => import('@/pages/admin/AdminHomeVideos'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#0f0f0f]">
    <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
  </div>
);

// Component to initialize hooks that require context
const AppHooksInit = () => {
  useGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID || '');
  return null;
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dream Black Horse",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21210 Horse Ranch Rd",
    "addressLocality": "Mt Dora",
    "addressRegion": "FL",
    "postalCode": "32757",
    "addressCountry": "US"
  },
  "email": "contact@dreamblackhorse.com",
  "url": "https://dreamblackhorse.com"
};

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
          <p className="text-gray-400 font-medium">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      <AppHooksInit />
      <ScrollToTop />
      
      {!isAdminRoute && <Header setIsCartOpen={setIsCartOpen} />}
      {!isAdminRoute && <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />}
      <CookieConsentBanner />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/horses" element={<HorsesForSale />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetailPage setIsCartOpen={setIsCartOpen} />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
              <Route path="/terms-policies" element={<TermsAndPoliciesPage />} />
              
              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/signup" element={<AdminSignupPage />} />
              <Route path="/admin/password-reset" element={<AdminPasswordResetPage />} />
              
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route path="/admin/dashboard/*" element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              } />

              <Route path="/admin/home-images" element={
                <ProtectedAdminRoute>
                  <AdminHomeImages />
                </ProtectedAdminRoute>
              } />

              <Route path="/admin/home-videos" element={
                <ProtectedAdminRoute>
                  <AdminHomeVideos />
                </ProtectedAdminRoute>
              } />

              <Route path="/admin/blog" element={
                <ProtectedAdminRoute>
                  <AdminBlogList />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/blog/new" element={
                <ProtectedAdminRoute>
                  <AdminBlogEditor />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/blog/:id" element={
                <ProtectedAdminRoute>
                  <AdminBlogEditor />
                </ProtectedAdminRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ConsentProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <ReviewsProvider>
                <AppContent />
              </ReviewsProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </ConsentProvider>
    </ErrorBoundary>
  );
}

export default App;