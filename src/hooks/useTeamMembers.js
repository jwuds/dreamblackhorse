import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryFetch } from '@/utils/retryFetch';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      });

      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'Failed to load team members');
      toast({
        title: "Error",
        description: "Failed to load team members. Please check connection.",
        variant: "destructive"
      });
      setTeamMembers([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addTeamMember = async (memberData) => {
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('team_members')
          .insert([memberData])
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      setTeamMembers(prev => [...prev, data].sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const updateTeamMember = async (id, memberData) => {
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('team_members')
          .update({ ...memberData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      setTeamMembers(prev => prev.map(item => item.id === id ? data : item).sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const deleteTeamMember = async (id) => {
    try {
      await retryFetch(async () => {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);

        if (error) throw error;
      });

      setTeamMembers(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  return { teamMembers, loading, error, fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember };
};