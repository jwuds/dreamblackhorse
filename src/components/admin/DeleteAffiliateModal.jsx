import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeleteAffiliateModal = ({ affiliate, onConfirm, onCancel, isDeleting }) => {
  if (!affiliate) return null;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-red-500/20 p-6 w-full max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400" />
      
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Delete Affiliate?</h3>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to remove <strong className="text-white">"{affiliate.name}"</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex w-full gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isDeleting}
            className="flex-1 border-white/20 text-gray-300 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
            ) : (
              'Yes, Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAffiliateModal;