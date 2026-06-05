import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminContent = () => {
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase.from('content').select('*');
    if (!error && data) {
      const map = {};
      data.forEach(item => { map[item.id] = item.data; });
      // Provide defaults from the wedding card if DB is empty
      if (!map['hero']) map['hero'] = { couple_names: "POOJA & JAGDISH", date: "July 6, 2026" };
      if (!map['venue']) map['venue'] = { name: "Poker Garden", description: "Behind Ichhapurna Balaji Temple, Sojat" };
      if (!map['timeline']) map['timeline'] = [
        { id: 1, title: 'घृतपान', time: 'July 1, 2026', desc: 'Auspicious Hour' },
        { id: 2, title: 'विनायक', time: 'July 2, 2026', desc: 'Auspicious Hour' },
        { id: 3, title: 'बड़ी बन्दोली', time: 'July 3, 2026', desc: 'Auspicious Hour' },
        { id: 4, title: 'बारात स्वागत', time: 'July 6, 2026', desc: 'Auspicious Hour' },
        { id: 5, title: 'पाणिग्रहण संस्कार', time: 'July 6, 2026', desc: 'Midnight' },
        { id: 6, title: 'प्रीतिभोज समारोह', time: 'July 6, 2026, 6:15 PM', desc: 'Poker Garden, Sojat' }
      ];
      if (!map['family']) map['family'] = {
        blessings: ["Smt. Mishri Devi &", "Late Shri Basti Ram Ji Panwar"],
        invitedBy: ["Jugraj Panwar - Vimla Devi", "Prakash Chand Panwar - Teeja Devi"],
        groomsFamily: ["Shri Chaina Ram Ji Rathore", "Smt. Sushila Devi"]
      };
      setContentMap(map);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    for (const [id, data] of Object.entries(contentMap)) {
      await supabase.from('content').upsert({ id, data });
    }
    setSaving(false);
    alert('Content saved successfully');
  };

  const updateContent = (val) => {
    try {
      const parsed = JSON.parse(val);
      setContentMap(prev => ({ ...prev, [activeTab]: parsed }));
    } catch(e) {
      // invalid json, ignore until valid
    }
  };

  if (loading) return <div className="text-champagne-gold">Loading content...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-serif text-champagne-gold uppercase tracking-widest">Manage Content</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-champagne-gold text-[#F8F4E8] uppercase tracking-wider text-xs font-semibold rounded hover:bg-royal-blue/20 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex space-x-2 border-b border-[#FFC300] pb-2">
        {Object.keys(contentMap).map(key => (
          <button 
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 uppercase tracking-wider text-xs rounded transition-colors ${activeTab === key ? 'bg-champagne-gold/20 text-champagne-gold' : 'text-[#F8F4E8]/60 hover:text-[#F8F4E8]'}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="bg-stationery-gradient/60 border border-[#FFC300] p-4 rounded shadow-inner">
        <p className="text-xs text-[#F8F4E8]/60 mb-2 uppercase tracking-widest">Edit JSON for {activeTab}</p>
        <textarea 
          className="w-full h-96 bg-transparent text-[#F8F4E8] font-mono text-sm outline-none resize-none"
          value={JSON.stringify(contentMap[activeTab], null, 2)}
          onChange={(e) => updateContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdminContent;


