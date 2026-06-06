import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Image as ImageIcon, Database, MessageSquare, Plus, Upload, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getProducts } from '@/api/EcommerceApi';

const DashboardOverview = () => {
  const { toast } = useToast();
  const [storeStats, setStoreStats] = useState({
    totalHorses: 0,
    activeProducts: 0,
    inventoryCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProducts();
        const products = data.products || [];
        
        let inventory = 0;
        let active = 0;
        
        products.forEach(p => {
          if (p.purchasable) active++;
          if (p.variants?.[0]?.inventory_quantity) {
            inventory += p.variants[0].inventory_quantity;
          }
        });

        setStoreStats({
          totalHorses: products.length,
          activeProducts: active,
          inventoryCount: inventory
        });
      } catch (error) {
        console.error("Error fetching store stats", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Products', value: storeStats.totalHorses.toString(), icon: Database, color: 'from-blue-600 to-blue-400' },
    { title: 'Active Listings', value: storeStats.activeProducts.toString(), icon: ImageIcon, color: 'from-purple-600 to-purple-400' },
    { title: 'Total Inventory', value: storeStats.inventoryCount.toString(), icon: MessageSquare, color: 'from-orange-600 to-orange-400' },
    { title: 'Admin Users', value: '1', icon: Users, color: 'from-green-600 to-green-400' },
  ];

  const handleAction = (action) => {
    toast({
      title: action,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome to your farm management command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#222] p-6 rounded-2xl border border-white/5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 luxury-border relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center border border-white/10">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl luxury-border">
          <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display']">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                <div className="w-12 h-16 rounded-md overflow-hidden bg-transparent">
                  <img 
                    src={`https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=200&q=80&sig=${i}`}
                    alt="Recent activity thumbnail"
                    className="horse-image-container"
                    style={{ padding: '2px', borderRadius: '6px' }}
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Store sync completed</p>
                  <p className="text-gray-500 text-xs mt-1">{i} hours ago by System</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#222] rounded-2xl border border-white/5 p-6 shadow-xl luxury-border">
          <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display']">Quick Actions</h3>
          <div className="space-y-4">
            <Button onClick={() => handleAction('Sync Store')} className="w-full justify-start bg-white text-black hover:bg-gray-200 h-12 rounded-xl font-semibold">
              <Database className="w-5 h-5 mr-3" /> Sync Online Store
            </Button>
            <Button onClick={() => handleAction('Upload Media')} variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10 h-12 rounded-xl font-semibold">
              <Upload className="w-5 h-5 mr-3" /> Upload Media
            </Button>
            <Button onClick={() => handleAction('View Messages')} variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10 h-12 rounded-xl font-semibold">
              <Mail className="w-5 h-5 mr-3" /> Check Messages
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;