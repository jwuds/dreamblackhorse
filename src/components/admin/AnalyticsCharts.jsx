import React from 'react';
import { motion } from 'framer-motion';

export const BarChartMock = ({ data, title }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full bg-[#111] p-6 rounded-xl border border-white/5">
      <h4 className="text-white font-medium mb-6">{title}</h4>
      <div className="h-48 flex items-end gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxVal) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="w-full bg-blue-500/50 hover:bg-blue-400 rounded-t-sm relative"
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                {item.value}
              </div>
            </motion.div>
            <span className="text-xs text-gray-500 truncate w-full text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChartMock = ({ data, title }) => {
  return (
    <div className="w-full bg-[#111] p-6 rounded-xl border border-white/5">
      <h4 className="text-white font-medium mb-6">{title}</h4>
      <div className="h-48 relative flex items-end">
        {/* Simple visual mock of a line chart using SVG */}
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0,80 Q20,60 40,70 T60,40 T80,50 T100,20" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="2" 
          />
          <motion.path 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            d="M0,80 Q20,60 40,70 T60,40 T80,50 T100,20 L100,100 L0,100 Z" 
            fill="#3b82f6" 
          />
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
      </div>
    </div>
  );
};

export const PieChartMock = ({ data, title }) => {
  return (
    <div className="w-full bg-[#111] p-6 rounded-xl border border-white/5 flex flex-col items-center">
      <h4 className="text-white font-medium mb-6 w-full text-left">{title}</h4>
      <div className="w-40 h-40 rounded-full relative bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 animate-[spin_10s_linear_infinite]" 
           style={{ background: 'conic-gradient(#3b82f6 0% 40%, #a855f7 40% 75%, #f97316 75% 100%)' }}>
        <div className="absolute inset-2 bg-[#111] rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{data.reduce((a,b)=>a+b.value,0)} Total</span>
        </div>
      </div>
      <div className="w-full mt-6 space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${i===0?'bg-blue-500':i===1?'bg-purple-500':'bg-orange-500'}`}></span>
              {item.label}
            </span>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};