import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const MatchForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    horseName: '',
    clientName: '',
    story: '',
    image: '',
    published: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] p-6 rounded-2xl border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Horse Name</label>
          <input
            type="text"
            name="horseName"
            value={formData.horseName}
            onChange={handleChange}
            className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-white focus:border-white/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-white focus:border-white/30"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Match Story</label>
        <textarea
          name="story"
          value={formData.story}
          onChange={handleChange}
          rows="4"
          className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-white focus:border-white/30 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Match Image URL</label>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-white focus:border-white/30"
              required
            />
          </div>
          {formData.image && (
            <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 pt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/20 bg-[#222] text-blue-500 focus:ring-blue-500/50"
          />
          <span className="text-sm font-medium text-white">Publish immediately</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-white hover:bg-white/5">
          Cancel
        </Button>
        <Button type="submit" className="bg-white text-black hover:bg-gray-200">
          Save Match
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;