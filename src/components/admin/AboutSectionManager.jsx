import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import MissionImageSelector from './MissionImageSelector';
import VisionImageSelector from './VisionImageSelector';
import DeliveryMapImageSelector from './DeliveryMapImageSelector';

const AboutSectionManager = () => {
  const [activeTab, setActiveTab] = useState('statements');
  const [statements, setStatements] = useState({ mission_statement: '', vision_statement: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('field_name, content')
        .eq('section_name', 'about');

      if (error) throw error;

      if (data && data.length > 0) {
        const newStatements = { ...statements };
        data.forEach(item => {
          if (item.field_name === 'mission_statement') newStatements.mission_statement = item.content;
          if (item.field_name === 'vision_statement') newStatements.vision_statement = item.content;
        });
        setStatements(newStatements);
      }
    } catch (err) {
      toast({ title: 'Error fetching statements', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveStatements = async () => {
    setSaving(true);
    try {
      const updates = [
        { section_name: 'about', field_name: 'mission_statement', content: statements.mission_statement },
        { section_name: 'about', field_name: 'vision_statement', content: statements.vision_statement }
      ];

      for (const update of updates) {
        const { data: existing } = await supabase
          .from('homepage_content')
          .select('id')
          .eq('section_name', update.section_name)
          .eq('field_name', update.field_name)
          .single();

        if (existing) {
          await supabase.from('homepage_content').update({ content: update.content }).eq('id', existing.id);
        } else {
          await supabase.from('homepage_content').insert(update);
        }
      }

      toast({ title: 'Success', description: 'Statements updated successfully.' });
    } catch (err) {
      toast({ title: 'Error saving', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 bg-[#1a1a1a] p-2 rounded-xl border border-white/10 w-fit">
        <button onClick={() => setActiveTab('statements')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'statements' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}>
          Statements
        </button>
        <button onClick={() => setActiveTab('mission_img')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'mission_img' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}>
          Mission Image
        </button>
        <button onClick={() => setActiveTab('vision_img')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'vision_img' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}>
          Vision Image
        </button>
        <button onClick={() => setActiveTab('delivery_img')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'delivery_img' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}>
          Delivery Map Image
        </button>
      </div>

      {activeTab === 'statements' && (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">About Statements Editor</h2>
          
          {loading ? (
            <div className="flex justify-center"><Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" /></div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mission Statement</label>
                <textarea
                  value={statements.mission_statement}
                  onChange={(e) => setStatements({ ...statements, mission_statement: e.target.value })}
                  className="w-full h-32 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  placeholder="Enter the mission statement..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Vision Statement</label>
                <textarea
                  value={statements.vision_statement}
                  onChange={(e) => setStatements({ ...statements, vision_statement: e.target.value })}
                  className="w-full h-32 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  placeholder="Enter the vision statement..."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={saveStatements} disabled={saving} className="bg-[#d4af37] text-black hover:bg-[#b5952f]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Statements
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mission_img' && <MissionImageSelector />}
      {activeTab === 'vision_img' && <VisionImageSelector />}
      {activeTab === 'delivery_img' && <DeliveryMapImageSelector />}
    </div>
  );
};

export default AboutSectionManager;