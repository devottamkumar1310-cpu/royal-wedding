import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import MagneticButton from '../shared/MagneticButton';

const BlessingsWall = () => {
  const [wishes, setWishes]       = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [name, setName]           = useState('');
  const [message, setMessage]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Initial fetch + realtime subscription ────────────────────────────────
  useEffect(() => {
    fetchWishes();

    // Realtime: push newly-added blessings without a full page reload
    const channel = supabase
      .channel('public:blessings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'blessings' },
        (payload) => {
          if (payload.new) {
            setWishes((current) => {
              // Avoid duplicates (optimistic insert already added a temp copy)
              const exists = current.some(
                (w) => w.id === payload.new.id || w._optimistic,
              );
              if (exists) {
                // Replace the optimistic entry with the real DB row
                return current.map((w) =>
                  w._optimistic ? { ...payload.new } : w,
                );
              }
              return [payload.new, ...current];
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchWishes = async () => {
    setFetchError('');
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        // Table does not exist yet — graceful degradation
        setWishes([]);
      } else {
        setFetchError('Could not load blessings. Please refresh.');
        console.error('[BlessingsWall] fetch error:', error);
      }
    } else {
      setWishes(data ?? []);
    }
    setLoading(false);
  };

  // ─── Date formatter ───────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    });
  };

  // ─── Submit with optimistic UI ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitError('');
    setSubmitting(true);

    // Optimistic entry — shown instantly while the DB write is in flight
    const optimisticEntry = {
      id:          `_opt_${Date.now()}`,
      guest_name:  name.trim(),
      message:     message.trim(),
      created_at:  new Date().toISOString(),
      _optimistic: true,       // internal marker
    };
    setWishes((current) => [optimisticEntry, ...current]);

    const { error } = await supabase
      .from('blessings')
      .insert([{ guest_name: name.trim(), message: message.trim() }]);

    if (error) {
      // Roll back the optimistic entry on failure
      setWishes((current) => current.filter((w) => !w._optimistic));
      setSubmitError('Could not save your blessing. Please try again.');
      console.error('[BlessingsWall] insert error:', error);
    } else {
      setName('');
      setMessage('');
      setShowForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
    setSubmitting(false);
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <motion.div
      key="blessings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-4"
    >
      <h2 className="font-serif text-center mb-16 uppercase tracking-[0.32em] font-light text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.9)] text-2xl md:text-3xl">
        Wall of Blessings
      </h2>

      {/* Success toast */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-6 py-3 bg-champagne-gold/10 border border-champagne-gold/40 text-champagne-gold text-sm tracking-wider rounded-sm"
          >
            ✦ Your blessing has been shared.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fetch error */}
      {fetchError && (
        <p className="mb-6 text-sm text-red-400/80 text-center">{fetchError}</p>
      )}

      {/* Blessings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {loading && (
          <div className="col-span-full py-12 text-center text-champagne-gold animate-pulse">
            Loading blessings…
          </div>
        )}

        {!loading && wishes.length === 0 && !fetchError && (
          <div className="col-span-full py-12 text-center text-ivory/50">
            Be the first to leave a blessing.
          </div>
        )}

        {wishes.map((wish, index) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
            className={`bg-royal-blue/20 backdrop-blur-md border-l-4 border-champagne-gold p-6 shadow-lg hover:bg-royal-blue/40 transition-colors duration-300 rounded-r-lg${
              wish._optimistic ? ' opacity-70' : ''
            }`}
          >
            <p className="text-ivory/90 font-display italic text-base md:text-lg leading-relaxed mb-4">"{wish.message}"</p>
            <p className="text-champagne-gold font-serif text-xs tracking-[0.18em] text-right font-light uppercase">
              — {wish.guest_name}
            </p>
            {wish.created_at && (
              <p className="text-ivory/40 font-sans text-[10px] text-right mt-1">
                {formatDate(wish.created_at)}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Leave a blessing CTA */}
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
              <h3 className="text-champagne-gold font-serif text-xl text-center mb-6 uppercase tracking-widest">
                Share Your Joy
              </h3>

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors mb-4 placeholder:text-ivory/30"
              />
              <textarea
                placeholder="Your Blessing…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full bg-black/20 border border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors mb-4 placeholder:text-ivory/30 resize-none"
              />

              {/* Inline submit error */}
              {submitError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400/90 text-center py-2 border border-red-400/20 rounded px-3 bg-red-400/5 mb-4"
                >
                  {submitError}
                </motion.p>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(''); }}
                  className="flex-1 py-3 text-ivory/70 uppercase tracking-widest text-xs hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  className="flex-1 py-3 bg-champagne-gold text-royal-blue uppercase tracking-widest text-xs font-semibold hover:bg-ivory transition-colors duration-500"
                >
                  {submitting ? 'Sending…' : 'Submit'}
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
