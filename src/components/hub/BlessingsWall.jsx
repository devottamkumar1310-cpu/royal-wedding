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
      <h2 
        className="font-greatvibes text-center mb-16 text-5xl font-normal"
        style={{ color: '#A95A1B' }}
      >
        Wall of Blessings
      </h2>

      {/* Success toast */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-6 py-3 bg-[#A95A1B]/10 border border-[#A95A1B]/30 text-sm tracking-wider rounded-sm font-lato"
            style={{ color: '#7A3F14' }}
          >
            ✦ Your blessing has been shared.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fetch error */}
      {fetchError && (
        <p className="mb-6 text-sm text-red-500/80 text-center font-lato">{fetchError}</p>
      )}

      {/* Blessings grid - reduced max-width to shrink cards by ~20% */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {loading && (
          <div className="col-span-full py-12 text-center text-[#D4922A] animate-pulse font-lato">
            Loading blessings…
          </div>
        )}

        {!loading && wishes.length === 0 && !fetchError && (
          <div className="col-span-full py-12 text-center text-[#5C3F2A]/50 font-lato font-light">
            Be the first to leave a blessing.
          </div>
        )}

        {wishes.map((wish, index) => {
          const isTerracotta = index % 2 !== 0;
          return (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              className={`p-5 md:p-6 shadow-[0_12px_30px_rgba(80,50,20,0.08)] hover:shadow-[0_20px_45px_rgba(80,50,20,0.15)] transition-all duration-500 rounded-sm relative overflow-hidden border flex flex-col items-center justify-center text-center ${
                isTerracotta
                  ? 'bg-[#C6653E] border-[#E8C37C]/20 text-[#FDF9F6]'
                  : 'bg-[#FDF9F6] border-[#C89B5A]/20 text-[#5C3F2A]'
              }${wish._optimistic ? ' opacity-70' : ''}`}
            >
              {/* Soft cotton paper texture grain */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.15] z-0 mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Delicate thin double border inset */}
              <div 
                className={`absolute inset-[6px] border pointer-events-none rounded-sm z-10 ${
                  isTerracotta ? 'border-[#E8C37C]/20' : 'border-[#C89B5A]/20'
                }`} 
              />

              {/* Single delicate botanical accent (bottom-left) */}
              <svg 
                className="absolute bottom-3 left-3 w-20 h-20 opacity-[0.35] pointer-events-none z-0" 
                viewBox="0 0 100 100" 
                fill="none" 
                stroke={isTerracotta ? '#E8C37C' : '#C2603C'} 
                strokeWidth="0.75"
              >
                <path d="M10,90 Q40,90 45,50 T90,10" strokeLinecap="round" />
                <path d="M45,50 Q60,30 80,40 Q65,60 45,50" fill={isTerracotta ? '#E8C37C' : '#C2603C'} fillOpacity="0.1" />
                <path d="M30,70 Q40,50 60,60 Q45,80 30,70" fill={isTerracotta ? '#E8C37C' : '#C2603C'} fillOpacity="0.1" />
                <path d="M20,80 Q25,65 40,70 Q30,85 20,80" fill={isTerracotta ? '#E8C37C' : '#C2603C'} fillOpacity="0.1" />
              </svg>

              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-[90%] mx-auto">
                {/* The Hero: The Blessing Quote */}
                <div className="relative mb-6 mt-4 w-full">
                  {/* Oversized Top-Left Quote */}
                  <span 
                    className="absolute -top-7 -left-3 md:-left-5 font-serif text-5xl md:text-6xl leading-none select-none"
                    style={{ color: isTerracotta ? '#E8C37C' : '#C2603C', opacity: 0.35 }}
                  >
                    “
                  </span>
                  
                  <p 
                    className="font-cormorant text-xl md:text-2xl leading-[1.6] font-medium relative z-10" 
                    style={{ 
                      color: isTerracotta ? '#FDF9F6' : '#5C3F2A',
                      textShadow: isTerracotta ? '0 1px 1px rgba(0,0,0,0.2)' : '0 1px 1px rgba(255,255,255,0.8)' 
                    }}
                  >
                    {wish.message}
                  </p>

                  {/* Oversized Bottom-Right Quote */}
                  <span 
                    className="absolute -bottom-9 -right-3 md:-right-5 font-serif text-5xl md:text-6xl leading-none select-none"
                    style={{ color: isTerracotta ? '#E8C37C' : '#C2603C', opacity: 0.35 }}
                  >
                    ”
                  </span>
                </div>

                {/* Signature Area */}
                <div className="mt-2 flex flex-col items-center">
                  <p 
                    className="font-greatvibes text-3.5xl md:text-4.5xl tracking-wide whitespace-nowrap"
                    style={{ color: isTerracotta ? '#E8C37C' : '#8C4F35' }}
                  >
                    {wish.guest_name}
                  </p>
                  {wish.created_at && (
                    <p 
                      className="font-lato font-light text-[9px] md:text-[10px] uppercase tracking-[0.25em] mt-1 whitespace-nowrap" 
                      style={{ color: isTerracotta ? 'rgba(253, 249, 246, 0.7)' : 'rgba(92, 63, 42, 0.6)' }}
                    >
                      {formatDate(wish.created_at)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leave a blessing CTA */}
      <div className="mt-12 w-full max-w-xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MagneticButton
                onClick={() => setShowForm(true)}
                className="btn-luxury px-8 py-3 uppercase tracking-[0.2em] shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 rounded-sm relative font-medium"
              >
                <span className="relative z-10">Leave a Blessing</span>
              </MagneticButton>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="relative w-full p-8 shadow-luxe-medium rounded-sm bg-[#F8F1E7] border border-[#A95A1B]/10 overflow-hidden"
            >
              {/* Fine paper grain overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.18] z-0 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              <h3 
                className="font-cormorant font-semibold text-lg text-center mb-6 uppercase tracking-widest relative z-10"
                style={{ color: '#A95A1B' }}
              >
                Share Your Joy
              </h3>

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="relative z-10 w-full bg-[#FDF9F6] border border-[#C89B5A]/45 p-3 text-[#5C3F2A] outline-none focus:border-[#C89B5A] transition-colors mb-4 placeholder:text-[#5C3F2A]/60 rounded-sm font-lato font-light"
              />
              <textarea
                placeholder="Your Blessing…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="relative z-10 w-full bg-[#FDF9F6] border border-[#C89B5A]/45 p-3 text-[#5C3F2A] outline-none focus:border-[#C89B5A] transition-colors mb-4 placeholder:text-[#5C3F2A]/60 resize-none rounded-sm font-lato font-light"
              />

              {/* Inline submit error */}
              {submitError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 text-sm text-red-500/90 text-center py-2 border border-red-500/20 rounded px-3 bg-red-500/5 mb-4 font-lato font-light"
                >
                  {submitError}
                </motion.p>
              )}

              <div className="flex space-x-4 relative z-10">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(''); }}
                  className="flex-1 py-3 text-[#5C3F2A]/70 uppercase tracking-widest text-xs hover:text-[#5C3F2A] transition-colors font-lato font-normal"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  className="btn-luxury flex-1 py-3 uppercase tracking-widest shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 relative"
                >
                  <span className="relative z-10">{submitting ? 'Sending…' : 'Submit'}</span>
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
