import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import MagneticButton from '../shared/MagneticButton';

const BlessingsWall = () => {
  const [wishes, setWishes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes();

    const subscription = supabase
      .channel('public:blessings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blessings' }, payload => {
        if (payload.new.is_approved) {
          setWishes(current => [payload.new, ...current]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setWishes(data);
    } else if (error && error.code === '42P01') {
       // Table doesn't exist yet, mock for now
       setWishes([{ id: '1', guest_name: 'System', message: 'Waiting for database setup...', is_approved: true }]);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitting(true);
    
    const { error } = await supabase.from('blessings').insert([
      { guest_name: name, message: message, is_approved: true }
    ]);

    if (!error) {
      setName('');
      setMessage('');
      setShowForm(false);
    } else {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <motion.div 
      key="blessings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-4"
    >
      <h2 className="text-2xl md:text-4xl text-champagne-gold font-serif text-center mb-10 tracking-[0.2em] uppercase drop-shadow-md">
        Wall of Blessings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {wishes.map((wish, index) => (
          <motion.div 
            key={wish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-royal-blue/20 backdrop-blur-md border-l-4 border-champagne-gold p-6 shadow-lg hover:bg-royal-blue/40 transition-colors duration-300 rounded-r-lg"
          >
            <p className="text-ivory/90 font-sans italic mb-4">"{wish.message}"</p>
            <p className="text-champagne-gold font-serif text-sm tracking-widest text-right">- {wish.guest_name}</p>
            {wish.created_at && (
              <p className="text-ivory/50 font-sans text-xs text-right mt-1">{formatDate(wish.created_at)}</p>
            )}
          </motion.div>
        ))}
        {wishes.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-ivory/50">
            Be the first to leave a blessing.
          </div>
        )}
        {loading && (
          <div className="col-span-full py-12 text-center text-champagne-gold animate-pulse">
            Loading blessings...
          </div>
        )}
      </div>

      <div className="mt-12 w-full max-w-xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MagneticButton 
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-royal-blue/60 backdrop-blur-md border border-champagne-gold text-champagne-gold uppercase tracking-[0.2em] text-sm hover:bg-champagne-gold hover:text-royal-blue transition-colors duration-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                Leave a Blessing
              </MagneticButton>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="w-full bg-royal-blue/40 backdrop-blur-xl border border-champagne-gold/30 p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] rounded-sm"
            >
              <h3 className="text-champagne-gold font-serif text-xl text-center mb-6 uppercase tracking-widest">Share Your Joy</h3>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors mb-4 placeholder:text-ivory/30"
              />
              <textarea 
                placeholder="Your Blessing..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full bg-black/20 border border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors mb-6 placeholder:text-ivory/30 resize-none"
              />
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 text-ivory/70 uppercase tracking-widest text-xs hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <MagneticButton 
                  className="flex-1 py-3 bg-champagne-gold text-royal-blue uppercase tracking-widest text-xs font-semibold hover:bg-ivory transition-colors duration-500"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlessingsWall;
