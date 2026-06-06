import React from 'react';

const HorseCustomFields = ({ product }) => {
  if (!product) return null;

  // Attempt to extract basic details from description or metadata if available from Ecommerce API
  const extractDetail = (keyword) => {
    if (!product.description) return null;
    const regex = new RegExp(`${keyword}:\\s*([^<\\n]+)`, 'i');
    const match = product.description.match(regex);
    return match ? match[1].trim() : null;
  };

  const details = [
    { label: 'Age', value: extractDetail('Age') },
    { label: 'Height', value: extractDetail('Height') },
    { label: 'Temperament', value: extractDetail('Temperament') },
    { label: 'Discipline', value: extractDetail('Discipline') },
  ].filter(d => d.value);

  if (details.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {details.map((detail, idx) => (
        <div key={idx} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 shadow-sm">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">{detail.label}</p>
          <p className="text-white font-medium">{detail.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HorseCustomFields;