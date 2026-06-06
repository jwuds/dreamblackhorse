import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const HorseManagementPanel = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/20 shadow-xl overflow-hidden p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground">Horse Management</h2>
          <p className="text-muted-foreground text-sm">Manage your inventory, prices, and SEO fields.</p>
        </div>
        <Button onClick={handleAction} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
          <Plus size={16} /> Add New Horse
        </Button>
      </div>

      <div className="overflow-x-auto border border-border/20 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="p-4 pl-6">Name</th>
              <th className="p-4">Breed</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            <tr className="hover:bg-white/[0.02]">
              <td className="p-4 pl-6 text-foreground font-medium">Example Horse</td>
              <td className="p-4 text-muted-foreground">Friesian</td>
              <td className="p-4 text-foreground">$15,000</td>
              <td className="p-4"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs">Active</span></td>
              <td className="p-4"><span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md text-xs">Yes</span></td>
              <td className="p-4 text-right pr-6 space-x-2">
                <button onClick={handleAction} className="p-2 bg-secondary rounded-lg text-blue-400 hover:bg-blue-400/10"><Edit size={16} /></button>
                <button onClick={handleAction} className="p-2 bg-secondary rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 size={16} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorseManagementPanel;