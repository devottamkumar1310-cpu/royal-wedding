import { motion } from 'framer-motion';
import FiligreeCorner from '../svg/FiligreeCorner';
import { useContent } from '../../hooks/useContent';

const FamilyScroll = () => {
  const { content, loading } = useContent('family');
  
  const defaultFamily = {
    blessings: ["श्रीमती मिश्रीदेवी एवं", "स्व. श्री बस्तीरामजी पंवार"],
    invitedBy: ["जुगराज पंवार - विमलादेवी", "प्रकाशचन्द पंवार - तीजादेवी"],
    groomsFamily: ["श्री चैनारामजी राठौड़", "श्रीमती सुशीलादेवी"]
  };
  
  const family = content || defaultFamily;

  return (
    <motion.div 
      key="family"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center pb-32 pt-8 px-4"
    >
      <h2 className="font-serif text-center mb-16 uppercase tracking-[0.32em] font-light text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] text-2xl md:text-3xl">
        Our Family
      </h2>

      <div className="relative w-full max-w-lg bg-[#FDFBF7] text-royal-blue p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-champagne-gold/50 rounded-sm">
        
        {/* Scroll Accents */}
        <FiligreeCorner position="top-left" className="absolute top-2 left-2 w-12 h-12 opacity-80" />
        <FiligreeCorner position="top-right" className="absolute top-2 right-2 w-12 h-12 opacity-80" />
        <FiligreeCorner position="bottom-left" className="absolute bottom-2 left-2 w-12 h-12 opacity-80" />
        <FiligreeCorner position="bottom-right" className="absolute bottom-2 right-2 w-12 h-12 opacity-80" />
        
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-5 bg-champagne-gold rounded-full shadow-md"></div>
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-5 bg-champagne-gold rounded-full shadow-md"></div>

        <div className="text-center space-y-10 mt-6 mb-6">
          
          <div>
            <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-champagne-gold font-semibold mb-4">With Blessings From</h3>
            {family.blessings.map((person, idx) => (
              <p key={idx} className="font-serif text-xl md:text-2xl font-semibold mb-1">{person}</p>
            ))}
          </div>

          <div className="w-16 h-[1px] bg-champagne-gold mx-auto"></div>

          <div>
            <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-champagne-gold font-semibold mb-4">Invited By</h3>
            {family.invitedBy.map((person, idx) => (
              <p key={idx} className="font-sans text-base md:text-lg uppercase tracking-wider mb-2">{person}</p>
            ))}
          </div>

          <div className="w-16 h-[1px] bg-champagne-gold mx-auto"></div>

          <div>
            <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-champagne-gold font-semibold mb-4">Groom's Family</h3>
            {family.groomsFamily.map((person, idx) => (
              <p key={idx} className="font-sans text-base md:text-lg uppercase tracking-wider mb-2">{person}</p>
            ))}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default FamilyScroll;
