import React from 'react';
import { Award, Star } from 'lucide-react';

const TrainingLevelBadge = ({ level = 'Started Under Saddle' }) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30 shadow-sm">
      <Award size={16} className="text-primary" />
      {level}
    </div>
  );
};

export default TrainingLevelBadge;