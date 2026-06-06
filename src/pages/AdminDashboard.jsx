import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Database, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  LineChart,
  SearchCheck,
  HardDrive,
  Mail,
  Share2,
  Eye,
  Map,
  TrendingUp,
  Link as LinkIcon,
  PenTool,
  Star,
  Users,
  ImagePlus,
  MapPin,
  Tractor
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Import sub-components
import DashboardOverview from '@/components/admin/DashboardOverview';
import HorseListingsAdmin from '@/components/admin/HorseListingsAdmin';
import CategoryManagement from '@/components/admin/CategoryManagement';
import MediaLibrary from '@/components/admin/MediaLibrary';
import ContentManagement from '@/components/admin/ContentManagement';
import BlogManagementPanel from '@/components/admin/BlogManagementPanel';
import ReviewManagementPanel from '@/components/admin/ReviewManagementPanel';
import OrdersAndInquiries from '@/components/admin/OrdersAndInquiries';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import SEOManagementTools from '@/components/admin/SEOManagementTools';
import AdvancedMessagingCenter from '@/components/admin/AdvancedMessagingCenter';
import SiteSettingsPanel from '@/components/admin/SiteSettingsPanel';
import BackupRestorePanel from '@/components/admin/BackupRestorePanel';
import ContactInfoPanel from '@/components/admin/ContactInfoPanel';
import SocialMediaMetadataPanel from '@/components/admin/SocialMediaMetadataPanel';
import SocialMediaPreviewPanel from '@/components/admin/SocialMediaPreviewPanel';
import SitemapManagementPanel from '@/components/admin/SitemapManagementPanel';
import IndexingStatusPanel from '@/components/admin/IndexingStatusPanel';
import CanonicalURLPanel from '@/components/admin/CanonicalURLPanel';
import AffiliatesManagementPanel from '@/components/admin/AffiliatesManagementPanel';
import CarouselManagementPanel from '@/components/admin/CarouselManagementPanel';
import BeginJourneyImageManagement from '@/components/admin/BeginJourneyImageManagement';
import TeamManagementPanel from '@/components/admin/TeamManagementPanel';
import MapDeliveryReachImageSelector from '@/components/admin/MapDeliveryReachImageSelector';
import ExploreFarmImageSelector from '@/components/admin/ExploreFarmImageSelector';

const LOGO_URL = "https://horizons-cdn.hostinger.com/1ee4ac76-1453-4dcc-a280-1aeb1d67f81b/9a6ccfbea5cec07ff7085d5e702c493d.jpg";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'messages', label: 'Inbox', icon: MessageSquare },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'horses', label: 'Horse Listings', icon: Database },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'media', label: 'Media Library', icon: ImageIcon },
        { id: 'carousel', label: 'Carousel Images', icon: ImageIcon },
        { id: 'journey_image', label: 'Journey Image', icon: ImagePlus },
        { id: 'map_delivery', label: 'Map Delivery Image', icon: MapPin },
        { id: 'explore_farm', label: 'Explore Farm Image', icon: Tractor },
        { id: 'content', label: 'Content Pages', icon: FileText },
        { id: 'blog', label: 'Blog Posts', icon: PenTool },
        { id: 'reviews', label: 'Reviews & Matches', icon: Star },
        { id: 'team', label: 'Team Members', icon: Users },
        { id: 'affiliates', label: 'Affiliates Mgmt', icon: Users },
        { id: 'contact_info', label: 'Contact Info', icon: Mail },
      ]
    },
    {
      title: 'SEO & Marketing',
      items: [
        { id: 'seo', label: 'SEO Tools', icon: SearchCheck },
        { id: 'social_meta', label: 'Social Metadata', icon: Share2 },
        { id: 'social_preview', label: 'Social Preview', icon: Eye },
        { id: 'sitemap', label: 'Sitemap', icon: Map },
        { id: 'indexing', label: 'Indexing Status', icon: TrendingUp },
        { id: 'canonical', label: 'Canonical URLs', icon: LinkIcon },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'backup', label: 'Backups', icon: HardDrive },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <DashboardOverview />;
      case 'analytics': return <AnalyticsPanel />;
      case 'horses': return <HorseListingsAdmin />;
      case 'categories': return <CategoryManagement />;
      case 'media': return <MediaLibrary />;
      case 'carousel': return <CarouselManagementPanel />;
      case 'journey_image': return <BeginJourneyImageManagement />;
      case 'map_delivery': return <MapDeliveryReachImageSelector />;
      case 'explore_farm': return <ExploreFarmImageSelector />;
      case 'content': return <ContentManagement />;
      case 'blog': return <BlogManagementPanel />;
      case 'reviews': return <ReviewManagementPanel />;
      case 'team': return <TeamManagementPanel />;
      case 'affiliates': return <AffiliatesManagementPanel />;
      case 'seo': return <SEOManagementTools />;
      case 'orders': return <OrdersAndInquiries />;
      case 'messages': return <AdvancedMessagingCenter />;
      case 'settings': return <SiteSettingsPanel />;
      case 'backup': return <BackupRestorePanel />;
      case 'contact_info': return <ContactInfoPanel />;
      case 'social_meta': return <SocialMediaMetadataPanel />;
      case 'social_preview': return <SocialMediaPreviewPanel />;
      case 'sitemap': return <SitemapManagementPanel />;
      case 'indexing': return <IndexingStatusPanel />;
      case 'canonical': return <CanonicalURLPanel />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dream Horse Classified - Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#111] flex overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? '280px' : '0px',
            x: isSidebarOpen ? 0 : (isMobile ? -280 : 0)
          }}
          className={`fixed lg:relative z-50 h-screen bg-[#1a1a1a] border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden shrink-0'}`}
        >
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src={LOGO_URL} 
                alt="Chess Knight Logo" 
                className="h-[30px] w-auto object-contain rounded-full shrink-0"
              />
              <span className="text-xl font-['Playfair_Display'] font-bold text-white truncate whitespace-nowrap">
                Admin Portal
              </span>
            </div>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white shrink-0">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
            {navGroups.map((group, idx) => (
              <div key={idx} className="px-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">{group.title}</h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                        activeSection === item.id 
                          ? 'bg-white text-black font-semibold shadow-lg' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-black' : 'text-gray-400'}`} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 shrink-0">
            <div className="mb-4 px-2">
              <p className="text-sm font-medium text-white truncate">{user?.email || 'admin@example.com'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="bg-[#1a1a1a] border-b border-white/5 h-20 flex items-center px-6 shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white truncate hidden sm:block">
                Dream Horse Classified Dashboard
              </h1>
            </div>
          </header>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </>
  );
};

export default AdminDashboard;