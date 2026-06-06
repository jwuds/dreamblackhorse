import React, { useState } from 'react';
import { Save, History, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const ContentManagementPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('homepage');

  const handleAction = () => {
    toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const tabs = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact Page' }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/20 shadow-xl overflow-hidden p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground">Content Management</h2>
        <p className="text-muted-foreground text-sm">Edit main website page content and sections.</p>
      </div>

      <div className="flex space-x-2 border-b border-border/20 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Hero Headline</label>
          <input type="text" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground" placeholder="Enter headline..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Content Editor</label>
          <textarea rows="8" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground resize-none" placeholder="Rich text content..." />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/20">
        <Button onClick={handleAction} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
          <Save size={16} /> Save Changes
        </Button>
        <Button onClick={handleAction} variant="outline" className="flex items-center gap-2 border-border/30">
          <Eye size={16} /> Preview
        </Button>
        <Button onClick={handleAction} variant="ghost" className="flex items-center gap-2 text-muted-foreground ml-auto">
          <History size={16} /> Version History
        </Button>
      </div>
    </div>
  );
};

export default ContentManagementPanel;