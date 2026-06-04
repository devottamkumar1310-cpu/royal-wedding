import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRsvps: 0,
    attending: 0,
    notAttending: 0,
    guestCount: 0,
    pendingBlessings: 0,
    galleryPhotos: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    let rsvps = [];
    try {
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (GOOGLE_SCRIPT_URL) {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const result = await response.json();
        if (result.status === 'success') {
          rsvps = result.data;
        }
      }
    } catch(e) {
      console.error("Google Sheets RSVP fetch failed", e);
    }

    const totalRsvps = rsvps.length;
    const attending = rsvps.filter(r => r.is_attending).length;
    const notAttending = totalRsvps - attending;
    const guestCount = rsvps.reduce((acc, curr) => acc + (curr.is_attending ? (parseInt(curr.guests_count) || 0) : 0), 0);

    let pendingBlessings = 0;
    try {
      const { count } = await supabase.from('blessings').select('*', { count: 'exact', head: true }).eq('is_approved', false);
      pendingBlessings = count || 0;
    } catch(e) {}

    let galleryPhotos = 0;
    try {
      const { data } = await supabase.storage.from('gallery-images').list();
      galleryPhotos = data ? data.filter(f => f.name !== '.emptyFolderPlaceholder').length : 0;
    } catch(e) {}

    setStats({ totalRsvps, attending, notAttending, guestCount, pendingBlessings, galleryPhotos });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-champagne-gold uppercase tracking-widest">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Total RSVPs</h3>
          <p className="text-4xl text-champagne-gold font-serif">{stats.totalRsvps}</p>
        </div>
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Total Attending</h3>
          <p className="text-4xl text-green-400 font-serif">{stats.attending}</p>
        </div>
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Not Attending</h3>
          <p className="text-4xl text-red-400 font-serif">{stats.notAttending}</p>
        </div>
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Total Guests</h3>
          <p className="text-4xl text-champagne-gold font-serif">{stats.guestCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Pending Blessings</h3>
          <p className="text-4xl text-champagne-gold font-serif">{stats.pendingBlessings}</p>
        </div>
        <div className="bg-royal-blue/40 border border-champagne-gold/20 p-6 rounded shadow-lg">
          <h3 className="text-ivory/60 uppercase tracking-widest text-xs mb-2">Gallery Photos</h3>
          <p className="text-4xl text-champagne-gold font-serif">{stats.galleryPhotos}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
