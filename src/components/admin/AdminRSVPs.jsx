import { useEffect, useState } from 'react';

const AdminRSVPs = () => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!GOOGLE_SCRIPT_URL) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();
      
      if (result.status === 'success') {
        setRsvps(result.data);
      }
    } catch (error) {
      console.error("Error fetching RSVPs from Google Sheets", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-champagne-gold">Loading RSVPs...</div>;

  const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.is_attending ? curr.guests_count : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-serif text-champagne-gold uppercase tracking-widest">Manage RSVPs</h1>
        <div className="text-right">
          <p className="text-xs text-ivory/60 uppercase tracking-widest">Total Confirmed Guests</p>
          <p className="text-3xl font-serif text-champagne-gold">{totalGuests}</p>
        </div>
      </div>
      
      <div className="bg-royal-blue/40 border border-champagne-gold/20 rounded shadow-lg overflow-hidden">
        <table className="w-full text-left text-sm text-ivory/80">
          <thead className="bg-black/20 text-champagne-gold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Guest Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Attending</th>
              <th className="px-6 py-4">Count</th>
              <th className="px-6 py-4">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne-gold/10">
            {rsvps.map((r, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold">{r.guest_name}</td>
                <td className="px-6 py-4">{r.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${r.is_attending ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {r.is_attending ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4">{r.guests_count}</td>
                <td className="px-6 py-4 max-w-xs truncate">{r.message || '-'}</td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-ivory/50">No RSVPs received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRSVPs;
