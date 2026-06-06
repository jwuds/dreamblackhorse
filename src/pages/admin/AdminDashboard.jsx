import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Image as ImageIcon, Video as VideoIcon, Youtube } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import HorseManagementPanel from '@/components/admin/HorseManagementPanel';
import BlogManagementPanel from '@/components/admin/BlogManagementPanel';
import ReviewManagementPanel from '@/components/admin/ReviewManagementPanel';
import AffiliatesManagementPanel from '@/components/admin/AffiliatesManagementPanel';
import DashboardOverview from '@/components/admin/DashboardOverview';
import SEOManagementPanel from '@/components/admin/SEOManagementPanel';
import CarouselManagementPanel from '@/components/admin/CarouselManagementPanel';
import ContentManagementPanel from '@/components/admin/ContentManagementPanel';
import TeamManagementPanel from '@/components/admin/TeamManagementPanel';
import SiteSettingsPanel from '@/components/admin/SiteSettingsPanel';
import MediaManagementPanel from '@/components/admin/MediaManagementPanel';
import AboutSectionManager from '@/components/admin/AboutSectionManager';
import HeroImageManager from '@/components/admin/HeroImageManager';
import YouTubeManagementPanel from '@/components/admin/YouTubeManagementPanel';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview />;
      case 'horses': return <HorseManagementPanel />;
      case 'blog': return <BlogManagementPanel />;
      case 'reviews': return <ReviewManagementPanel />;
      case 'affiliates': return <AffiliatesManagementPanel />;
      case 'team': return <TeamManagementPanel />;
      case 'seo': return <SEOManagementPanel />;
      case 'media': return <MediaManagementPanel />;
      case 'carousel': return <CarouselManagementPanel />;
      case 'content': return <ContentManagementPanel />;
      case 'about': return <AboutSectionManager />;
      case 'settings': return <SiteSettingsPanel />;
      case 'hero-images': return <HeroImageManager />;
      case 'youtube': return <YouTubeManagementPanel />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <>
      <SEOHead 
        title="Admin Dashboard - Dream Black Horse"
        description="Admin Dashboard - Manage horses, blog posts, images, and site content at Dream Black Horse."
        canonical="/admin/dashboard"
      />
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <h1 className="sr-only">Admin Dashboard - Dream Black Horse</h1>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 min-h-screen overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Actions Bar */}
            {activeTab === 'overview' && (
              <div className="mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/10 flex gap-4 overflow-x-auto items-center">
                <span className="text-gray-400 font-medium whitespace-nowrap text-sm uppercase tracking-wider">Quick Links:</span>
                <Button 
                  onClick={() => setActiveTab('hero-images')}
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 whitespace-nowrap font-bold h-9 px-4"
                >
                  Manage Hero Images
                </Button>
                <Button 
                  onClick={() => setActiveTab('youtube')}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10 whitespace-nowrap font-bold h-9 px-4"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube Videos
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                <Link to="/admin/home-images">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap h-9 px-4">
                    <ImageIcon className="w-4 h-4 mr-2" /> Home Images
                  </Button>
                </Link>
                <Link to="/admin/home-videos">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap h-9 px-4">
                    <VideoIcon className="w-4 h-4 mr-2" /> Home Videos
                  </Button>
                </Link>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;