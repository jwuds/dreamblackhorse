import React from 'react';
import { Ruler, Activity, Heart, Award, Info, Zap, Shield, Star } from 'lucide-react';

const ICON_MAP = {
  ruler: Ruler,
  activity: Activity,
  heart: Heart,
  award: Award,
  info: Info,
  zap: Zap,
  shield: Shield,
  star: Star
};

const HorseFacts = ({ facts = [] }) => {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="my-12">
      <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6 flex items-center gap-3">
        <Info className="w-6 h-6 text-[#d4af37]" />
        Quick Breed Facts
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {facts.map((fact, idx) => {
          const Icon = ICON_MAP[fact.icon?.toLowerCase()] || Info;
          return (
            <div key={idx} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-[#d4af37]/30 transition-colors shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0 border border-[#d4af37]/20">
                <Icon className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{fact.title}</h4>
                <p className="text-white font-medium text-lg">{fact.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorseFacts;