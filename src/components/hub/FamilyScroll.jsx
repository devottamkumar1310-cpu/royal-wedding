import { motion } from 'framer-motion';
import { useContent } from '../../hooks/useContent';

const FamilyScroll = () => {
  const { content, loading } = useContent('family');
  
  const defaultFamily = {
    blessings: ["Smt. Mishri Devi &", "Late Shri Basti Ram Ji Panwar"],
    invitedBy: ["Jugraj Panwar - Vimla Devi", "Prakash Chand Panwar - Teeja Devi"],
    groomsFamily: ["Shri Chaina Ram Ji Rathore", "Smt. Sushila Devi"]
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
      <h2 className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal">
        Our Family
      </h2>

      <div className="relative w-full max-w-lg bg-stationery-gradient p-8 md:p-12 shadow-luxe-medium rounded-sm">
        
        <div className="text-center space-y-10 mt-6 mb-6">
          
          <div>
            <h3 className="font-cormorant text-xs tracking-[0.2em] uppercase text-rose-accent font-semibold mb-4">With Blessings From</h3>
            {family.blessings.map((person, idx) => (
              <p key={idx} className="font-lato font-light text-lg md:text-xl mb-1 text-[#5C3F2A]">{person}</p>
            ))}
          </div>

          <div className="w-12 h-[1px] bg-[#B2C9A7]/30 mx-auto"></div>

          <div>
            <h3 className="font-cormorant text-xs tracking-[0.2em] uppercase text-rose-accent font-semibold mb-4">Invited By</h3>
            {family.invitedBy.map((person, idx) => (
              <p key={idx} className="font-lato font-light text-sm md:text-base uppercase tracking-wider mb-2 text-[#5C3F2A]">{person}</p>
            ))}
          </div>

          <div className="w-12 h-[1px] bg-[#B2C9A7]/30 mx-auto"></div>

          <div>
            <h3 className="font-cormorant text-xs tracking-[0.2em] uppercase text-rose-accent font-semibold mb-4">Groom's Family</h3>
            {family.groomsFamily.map((person, idx) => (
              <p key={idx} className="font-lato font-light text-sm md:text-base uppercase tracking-wider mb-2 text-[#5C3F2A]">{person}</p>
            ))}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default FamilyScroll;
