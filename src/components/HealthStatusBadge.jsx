import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const HealthStatusBadge = ({ status = 'Sound & Healthy' }) => {
  const isHealthy = status.toLowerCase().includes('health') || status.toLowerCase().includes('sound') || status.toLowerCase().includes('excellent');
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
      isHealthy 
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }`}>
      {isHealthy ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
      {status}
    </div>
  );
};

export default HealthStatusBadge;