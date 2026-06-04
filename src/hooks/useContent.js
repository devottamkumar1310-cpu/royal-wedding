import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useContent = (sectionId) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();

    const subscription = supabase
      .channel(`public:content:${sectionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content', filter: `id=eq.${sectionId}` }, payload => {
        setContent(payload.new.data);
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [sectionId]);

  const fetchContent = async () => {
    const { data, error } = await supabase.from('content').select('data').eq('id', sectionId).single();
    if (!error && data) {
      setContent(data.data);
    }
    setLoading(false);
  };

  return { content, loading };
};
