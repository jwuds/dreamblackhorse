import { useState, useEffect, useCallback } from 'react';
import { retryFetch } from '@/utils/retryFetch';

const STORAGE_KEY = 'dream_horse_contact_info';

const defaultContactInfo = [
  { id: '1', type: 'phone', label: 'Main Phone', value: '+1 (555) 123-4567', visible: true },
  { id: '2', type: 'email', label: 'Support Email', value: 'info@dreamblackhorse.com', visible: true },
  { id: '3', type: 'address', label: 'Farm Location', value: '123 Equestrian Way, Lexington, KY 40502', visible: true },
  { id: '4', type: 'hours', label: 'Business Hours', value: 'Mon-Sat: 8am - 6pm, Sun: Closed', visible: true }
];

export const useContactInfo = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Wrapped in retryFetch to gracefully handle any async fetch mechanisms seamlessly if upgraded to DB
      const loadedContacts = await retryFetch(async () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
        return defaultContactInfo;
      }, 3, 500);
      
      setContacts(loadedContacts);
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContactInfo));
      }
    } catch (err) {
      console.error('Failed to load contact info', err);
      setError('Failed to load contact info');
      setContacts([]); // Gracefully degrade to empty array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const saveContacts = async (newContacts) => {
    try {
      await retryFetch(async () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
      });
      setContacts(newContacts);
    } catch (err) {
      console.error('Failed to save contact info', err);
      setError('Failed to save contact settings');
    }
  };

  const addContact = (contact) => {
    const newContact = { ...contact, id: Date.now().toString(), visible: true };
    saveContacts([...contacts, newContact]);
  };

  const editContact = (id, updatedFields) => {
    const newContacts = contacts.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    saveContacts(newContacts);
  };

  const deleteContact = (id) => {
    const newContacts = contacts.filter(c => c.id !== id);
    saveContacts(newContacts);
  };

  const reorderContacts = (startIndex, endIndex) => {
    const result = Array.from(contacts);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    saveContacts(result);
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    addContact,
    editContact,
    deleteContact,
    reorderContacts,
    getContactInfo: () => contacts.filter(c => c.visible)
  };
};