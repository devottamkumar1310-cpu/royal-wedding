import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const TiltFrame = ({ frame, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const springY = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-1000 w-full"
    >
      <motion.div
        className="group relative w-full aspect-square md:aspect-[4/3] rounded overflow-hidden border-2 border-champagne-gold/40 hover:border-champagne-gold cursor-pointer transition-colors duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fluid Gradient Background (Fallback) */}
        {!frame.publicUrl && (
          <motion.div 
            className="absolute inset-0"
            style={{
              background: frame.bg,
              backgroundSize: '200% 200%'
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Real Image */}
        {frame.publicUrl && (
          <div className="absolute inset-0">
            <img src={frame.publicUrl} alt={frame.title} loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
          </div>
        )}

        {/* Abstract placeholder for images - maintaining luxury feel */}
        {!frame.publicUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
             <div className="w-24 h-24 border border-champagne-gold/30 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 shadow-inner">
               <div className="w-16 h-16 border border-champagne-gold/50 rounded-full flex items-center justify-center bg-royal-blue/30 backdrop-blur-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                     <circle cx="8.5" cy="8.5" r="1.5"></circle>
                     <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
               </div>
             </div>
          </div>
        )}

        {/* Dynamic Metallic Glare */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-60 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 60%)`,
            left: glareX,
            top: glareY,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%'
          }}
        />
        
        {/* Hover overlay text */}
        <div className="absolute inset-0 bg-royal-blue/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm z-30" style={{ transform: "translateZ(50px)" }}>
          <h3 className="text-champagne-gold font-serif text-xl md:text-2xl tracking-widest uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
            {frame.title}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MemoriesGallery = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackFrames = [
    { id: 1, title: 'Engagement', bg: 'linear-gradient(135deg, #071e2c, #0B3046, #12405a)' },
    { id: 2, title: 'Pre-Wedding', bg: 'linear-gradient(45deg, #0B3046, #071e2c, #0d2b3b)' },
    { id: 3, title: 'Haldi Highlights', bg: 'linear-gradient(225deg, #071e2c, #0d2b3b, #0B3046)' },
    { id: 4, title: 'Family Moments', bg: 'linear-gradient(315deg, #0B3046, #071e2c, #12405a)' }
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(item => {
        const { data: publicData } = supabase.storage.from('gallery-images').getPublicUrl(item.storage_path);
        return {
          id: item.id,
          title: item.category || 'Memory',
          publicUrl: publicData.publicUrl
        };
      });
      setFrames(mapped);
    } else {
      setFrames(fallbackFrames);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-6"
    >
      <h2 className="text-2xl md:text-4xl text-champagne-gold font-serif text-center mb-10 tracking-[0.2em] uppercase drop-shadow-md">
        Royal Memories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {frames.map((frame, index) => (
          <TiltFrame key={frame.id} frame={frame} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default MemoriesGallery;
