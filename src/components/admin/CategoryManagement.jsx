import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CategoryManagement = () => {
  const { toast } = useToast();

  const mockCategories = [
    { id: 1, name: 'Stallions', count: 8, slug: 'stallions' },
    { id: 2, name: 'Mares', count: 12, slug: 'mares' },
    { id: 3, name: 'Geldings', count: 4, slug: 'geldings' },
    { id: 4, name: 'Foals', count: 0, slug: 'foals' },
  ];

  const handleAction = (action, categoryName = '') => {
    toast({
      title: `${action} ${categoryName}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">Category Management</h2>
          <p className="text-gray-400">Organize your horses into specific breed or type categories.</p>
        </div>
        <Button onClick={() => handleAction('Add New Category')} className="bg-white text-black hover:bg-gray-200 rounded-xl font-semibold px-6">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-[#222] rounded-2xl border border-white/5 shadow-xl luxury-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Category Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Horse Count</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockCategories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors group text-gray-300">
                  <td className="p-4 font-medium text-white">{category.name}</td>
                  <td className="p-4 font-mono text-sm text-gray-500">/{category.slug}</td>
                  <td className="p-4">
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {category.count}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleAction('Edit', category.name)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('Delete', category.name)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryManagement;