import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

const ReviewForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    text: initialData?.text || '',
    rating: initialData?.rating || 5,
    image: initialData?.image || '',
    published: initialData?.published ?? true,
    date: initialData?.date || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#222] p-6 rounded-2xl border border-white/5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Client Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Client Email (Optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Review Message</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows="4"
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Star Rating (1-5)</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Review Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Client Image URL (Optional)</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white"
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          className="rounded border-white/10 bg-[#111] text-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-300">
          Publish Review (Visible to public)
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" className="bg-white text-black hover:bg-gray-200">
          <Save className="w-4 h-4 mr-2" /> Save Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;