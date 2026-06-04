import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminBlessings = () => {
  const [blessings, setBlessings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlessings();
  }, []);

  const fetchBlessings = async () => {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setBlessings(data);
    }
    setLoading(false);
  };

  const toggleApproval = async (id, currentStatus) => {
    await supabase.from('blessings').update({ is_approved: !currentStatus }).eq('id', id);
    fetchBlessings();
  };

  const deleteBlessing = async (id) => {
    if(window.confirm('Are you sure you want to delete this blessing?')) {
      await supabase.from('blessings').delete().eq('id', id);
      fetchBlessings();
    }
  };

  if (loading) return <div className="text-champagne-gold">Loading blessings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-champagne-gold uppercase tracking-widest">Manage Blessings</h1>
      <div className="bg-royal-blue/40 border border-champagne-gold/20 rounded shadow-lg overflow-hidden">
        <table className="w-full text-left text-sm text-ivory/80">
          <thead className="bg-black/20 text-champagne-gold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Guest Name</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne-gold/10">
            {blessings.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold">{b.guest_name}</td>
                <td className="px-6 py-4 max-w-xs truncate">{b.message}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleApproval(b.id, b.is_approved)} className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${b.is_approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {b.is_approved ? 'Approved' : 'Pending'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => deleteBlessing(b.id)} className="text-red-400 hover:text-red-300 uppercase tracking-wider text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {blessings.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-ivory/50">No blessings received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlessings;
