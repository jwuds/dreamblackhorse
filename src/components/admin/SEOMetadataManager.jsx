import React, { useState } from 'react';
import { Search, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const SEOMetadataManager = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/20 shadow-xl overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground">SEO Metadata Manager</h2>
          <p className="text-muted-foreground text-sm">Optimize your pages for search engines.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Page</label>
            <select className="w-full bg-input border border-border/30 rounded-xl px-4 py-2.5 text-foreground appearance-none">
              <option>Homepage (/)</option>
              <option>Horses For Sale (/horses)</option>
              <option>About Us (/about)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Meta Title</label>
            <input type="text" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground" placeholder="Dream Black Horse | Premium Friesians" />
            <p className="text-xs text-muted-foreground text-right">38/60 chars</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Meta Description</label>
            <textarea rows="3" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground resize-none" placeholder="Discover exceptional..." />
            <p className="text-xs text-muted-foreground text-right">124/160 chars</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Target Keywords</label>
            <input type="text" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground" placeholder="friesian horses, black horses for sale" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Canonical URL</label>
            <input type="text" className="w-full bg-input border border-border/30 rounded-xl px-4 py-2 text-foreground" placeholder="https://dreamblackhorse.com" />
          </div>

          <Button onClick={handleAction} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
            <Save size={16} /> Update SEO
          </Button>
        </div>

        <div className="bg-background rounded-xl border border-border/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Search size={16} /> Search Result Preview
          </h3>
          <div className="bg-white p-4 rounded-lg shadow-sm font-sans space-y-1">
            <span className="text-xs text-gray-500 font-medium">https://dreamblackhorse.com › ...</span>
            <h4 className="text-[#1a0dab] text-xl cursor-pointer hover:underline">Dream Black Horse | Premium Friesians</h4>
            <p className="text-[#4d5156] text-sm leading-snug">Discover exceptional Friesian horses for sale. We specialize in breeding, training, and matching you with your dream black horse...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOMetadataManager;