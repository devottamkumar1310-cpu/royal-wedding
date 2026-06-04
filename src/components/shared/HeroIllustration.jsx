import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

const HeroIllustration = ({ assetName, priority = false, FallbackComponent, fallbackProps = {}, className = "", ...motionProps }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const { data: webpData } = supabase.storage.from('hero-assets').getPublicUrl(`${assetName}.webp`);
    const { data: pngData } = supabase.storage.from('hero-assets').getPublicUrl(`${assetName}.png`);
    
    const tryLoad = (url, onSuccess, onFail) => {
      const img = new Image();
      img.onload = () => { if(isMounted) onSuccess(url); };
      img.onerror = () => { if(isMounted) onFail(); };
      img.src = url;
    };

    // 1. Try WebP first for best performance
    tryLoad(webpData.publicUrl, 
      (url) => { setImageUrl(url); setLoading(false); }, 
      () => {
        // 2. Fallback to PNG
        tryLoad(pngData.publicUrl,
          (url) => { setImageUrl(url); setLoading(false); },
          () => { setError(true); setLoading(false); } // 3. Fallback to SVG
        );
      }
    );
    
    return () => { isMounted = false; };
  }, [assetName]);

  return (
    <motion.div className={`relative flex items-center justify-center ${className}`} {...motionProps}>
      {loading ? (
         <FallbackComponent {...fallbackProps} />
      ) : (
        (!error && imageUrl) ? (
          <img 
            src={imageUrl} 
            alt={assetName} 
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
          />
        ) : (
          <FallbackComponent {...fallbackProps} />
        )
      )}
    </motion.div>
  );
};

export default HeroIllustration;
