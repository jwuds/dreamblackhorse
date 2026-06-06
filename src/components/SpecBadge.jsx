import React from 'react';

const SpecBadge = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex flex-col p-3 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1 font-semibold">
        {Icon && <Icon size={14} className="text-primary/70" />}
        {label}
      </span>
      <span className="text-sm font-bold text-foreground truncate">{value || 'N/A'}</span>
    </div>
  );
};

export default SpecBadge;