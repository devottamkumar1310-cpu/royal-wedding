import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

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
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="perspective-1000 w-full"
    >
      <motion.div
        className="group relative w-full aspect-square md:aspect-[4/3] bg-stationery-gradient p-3 md:p-4 shadow-luxe-medium hover:shadow-[0_16px_30px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-500 rounded-sm"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Inner photo container */}
        <div className="relative w-full h-full overflow-hidden bg-white rounded-sm">
          {/* Fluid Gradient Background (Fallback) */}
          {!frame.publicUrl && (
            <motion.div 
              className="absolute inset-0"
              style={{
                background: frame.bg || 'linear-gradient(135deg, #E2EDDE, #F4FBF0, #E2EDDE)',
                backgroundSize: '200% 200%'
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Real Image */}
          {frame.publicUrl && (
            <div className="absolute inset-0 w-full h-full">
              <img src={frame.publicUrl} alt={frame.title} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#5C3F2A]/5 group-hover:bg-[#5C3F2A]/0 transition-colors duration-500" />
            </div>
          )}

          {/* Abstract placeholder for images - maintaining luxury feel */}
          {!frame.publicUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
               <div className="w-16 h-16 border border-[#B2C9A7]/30 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 shadow-inner">
                  <div className="w-12 h-12 border border-[#B2C9A7]/50 rounded-full flex items-center justify-center bg-[#EDF5E9] backdrop-blur-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4922A" strokeWidth="1">
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
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              left: glareX,
              top: glareY,
              transform: 'translate(-50%, -50%)',
              width: '200%',
              height: '200%'
            }}
          />
          
          {/* Hover overlay text */}
          <div className="absolute inset-3 bg-stationery-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center backdrop-blur-sm z-30 shadow-luxe-medium" style={{ transform: "translateZ(40px)" }}>
            <h3 className="text-rose-accent font-greatvibes text-2xl md:text-3xl mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              {frame.title}
            </h3>
            <p className="text-[#D4922A] font-cormorant italic text-xs tracking-wider uppercase translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              Wedding Memory
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MemoriesGallery = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyuX6fJn9h41iXZWxbaxzjBz0aGZ_7z9UmmKMnpvjQSXAReKC6U5CcZxutouazCr3iz/exec";
  const driveRootId = import.meta.env.VITE_DRIVE_FOLDER_ID || "1fcHs_FnyV-sMolypjj7wul7H8yRmahgs";

  useEffect(() => {
    if(scriptUrl && driveRootId) fetchGallery();
    else setLoading(false);
  }, [scriptUrl, driveRootId]);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${scriptUrl}?action=list&folderId=${driveRootId}`);
      const text = await res.text();
      console.log("Raw Response:", text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e);
      }

      console.log('Gallery API Response:', data);
      
      if (data && data.success && data.folders) {
        setFolders(data.folders);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setLoading(false);
  };

  const totalImages = folders.reduce((sum, f) => sum + (f.images?.length || 0), 0);
  console.log("React Render Path -> folders.length:", folders.length, "images.length:", totalImages);

  return (
    <motion.div 
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-6"
    >
      <h2 className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal">
        Royal Memories
      </h2>

      {loading && (
        <div className="text-[#D4922A] tracking-widest uppercase text-xs font-lato">Loading memories...</div>
      )}

      {!loading && folders.length === 0 && (
        <div className="text-[#5C3F2A]/50 mt-10 tracking-widest uppercase text-xs font-lato font-light">
          No photos available yet
        </div>
      )}

      {!loading && folders.map((folder, folderIndex) => {
        if (!folder.images || folder.images.length === 0) return null;
        
        return (
          <section key={folder.id} className="w-full max-w-4xl mb-24 last:mb-0">
            {/* Premium Section Heading */}
            <div className="flex flex-col items-center mb-12">
              <h3 className="font-cormorant text-rose-accent text-xl md:text-2xl tracking-[0.15em] uppercase mb-4 text-center font-semibold">
                {folder.name}
              </h3>
              <div className="flex items-center w-full max-w-xs opacity-30">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#B2C9A7] to-transparent w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {folder.images.map((img, index) => (
                <TiltFrame 
                  key={img.id} 
                  frame={{ id: img.id, title: folder.name, publicUrl: img.thumbnail }} 
                  index={index} 
                />
              ))}
            </div>
          </section>
        );
      })}
    </motion.div>
  );
};

export default MemoriesGallery;
