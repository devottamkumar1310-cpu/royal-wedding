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
      if (!map['hero']) map['hero'] = { couple_names: "पूजा & जगदीश", date: "06 जुलाई 2026" };
      if (!map['venue']) map['venue'] = { name: "पोकर गार्डन", description: "ईच्छापूर्ण बालाजी मंदिर के पीछे, सोजत" };
      if (!map['timeline']) map['timeline'] = [
        { id: 1, title: 'घृतपान', time: '01 जुलाई 2026', desc: 'शुभ वेला में' },
        { id: 2, title: 'विनायक', time: '02 जुलाई 2026', desc: 'शुभ वेला में' },
        { id: 3, title: 'बड़ी बन्दोली', time: '03 जुलाई 2026', desc: 'शुभ वेला में' },
        { id: 4, title: 'बारात स्वागत', time: '06 जुलाई 2026', desc: 'शुभ वेला में' },
        { id: 5, title: 'पाणिग्रहण संस्कार', time: '06 जुलाई 2026', desc: 'मध्यरात्रि' },
        { id: 6, title: 'प्रीतिभोज समारोह', time: '06 जुलाई 2026, 6:15 PM', desc: 'पोकर गार्डन, सोजत' }
      ];
      if (!map['family']) map['family'] = {
        blessings: ["श्रीमती मिश्रीदेवी एवं", "स्व. श्री बस्तीरामजी पंवार"],
        invitedBy: ["जुगराज पंवार - विमलादेवी", "प्रकाशचन्द पंवार - तीजादेवी"],
        groomsFamily: ["श्री चैनारामजी राठौड़", "श्रीमती सुशीलादेवी"]
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
          className="px-6 py-2 bg-champagne-gold text-royal-blue uppercase tracking-wider text-xs font-semibold rounded hover:bg-ivory transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex space-x-2 border-b border-champagne-gold/20 pb-2">
        {Object.keys(contentMap).map(key => (
          <button 
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 uppercase tracking-wider text-xs rounded transition-colors ${activeTab === key ? 'bg-champagne-gold/20 text-champagne-gold' : 'text-ivory/60 hover:text-ivory'}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="bg-black/40 border border-champagne-gold/20 p-4 rounded shadow-inner">
        <p className="text-xs text-ivory/60 mb-2 uppercase tracking-widest">Edit JSON for {activeTab}</p>
        <textarea 
          className="w-full h-96 bg-transparent text-ivory font-mono text-sm outline-none resize-none"
          value={JSON.stringify(contentMap[activeTab], null, 2)}
          onChange={(e) => updateContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdminContent;
