import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getProducts } from '@/api/EcommerceApi';

const HorseListingsAdmin = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const handleAction = (action, horseName = '') => {
    toast({
      title: `${action} ${horseName}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Store Listings</h2>
          <p className="text-gray-400">Manage your farm's products from the Online Store.</p>
        </div>
        <Button onClick={() => handleAction('Sync Store')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-bold px-6 py-6">
          <Plus className="w-5 h-5 mr-2" /> Sync Store
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 bg-[#222]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors font-medium"
            />
          </div>
          <Button variant="outline" onClick={() => handleAction('Filter')} className="border-white/10 text-white hover:bg-white/5 rounded-xl py-6 px-6 font-bold">
            <Filter className="w-5 h-5 mr-2" /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-6">Preview</th>
                <th className="p-6">Name & Details</th>
                <th className="p-6">Price</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const variant = product.variants?.[0];
                  const price = variant?.price_formatted || 'N/A';
                  const inStock = variant?.inventory_quantity > 0;
                  const status = product.purchasable && inStock ? 'Available' : 'Sold/Unavailable';

                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group text-gray-300">
                      <td className="p-6 w-64">
                        <div className="w-48">
                          <img 
                            src={product.image || ''} 
                            alt={`Preview of ${product.title}`} 
                            className="horse-image-container-sm w-full h-[200px] object-cover rounded-xl"
                            loading="lazy"
                          />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-white mb-1 font-['Playfair_Display']">{product.title}</span>
                          <span className="text-gray-400 font-medium">{product.subtitle || 'Product'}</span>
                        </div>
                      </td>
                      <td className="p-6 font-bold text-lg text-white">{price}</td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wider uppercase border ${
                          status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAction('Preview', product.title)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors bg-black/20 border border-white/5">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleAction('Edit', product.title)} className="p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-colors bg-black/20 border border-white/5">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleAction('Delete', product.title)} className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors bg-black/20 border border-white/5">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default HorseListingsAdmin;