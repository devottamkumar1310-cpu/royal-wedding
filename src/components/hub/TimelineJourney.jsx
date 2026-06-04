import { motion } from 'framer-motion';
import { useContent } from '../../hooks/useContent';

const TimelineJourney = () => {
  const { content, loading } = useContent('timeline');

  const defaultEvents = [
    { id: 1, title: 'घृतपान', time: '01 जुलाई 2026', desc: 'शुभ वेला में' },
    { id: 2, title: 'विनायक', time: '02 जुलाई 2026', desc: 'शुभ वेला में' },
    { id: 3, title: 'बड़ी बन्दोली', time: '03 जुलाई 2026', desc: 'शुभ वेला में' },
    { id: 4, title: 'बारात स्वागत', time: '06 जुलाई 2026', desc: 'शुभ वेला में' },
    { id: 5, title: 'पाणिग्रहण संस्कार', time: '06 जुलाई 2026', desc: 'मध्यरात्रि' },
    { id: 6, title: 'प्रीतिभोज समारोह', time: '06 जुलाई 2026, 6:15 PM', desc: 'पोकर गार्डन, सोजत' }
  ];

  const events = content || defaultEvents;

  return (
    <motion.div 
      key="journey"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-8 px-6"
    >
      <div className="max-w-md mx-auto relative">
        
        {/* The Golden Timeline Line running down the left side */}
        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-champagne-gold/30"></div>

        <h2 className="text-2xl text-champagne-gold font-serif text-center mb-10 tracking-[0.2em] uppercase">
          The Royal Journey
        </h2>

        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="relative pl-12 md:pl-16"
            >
              {/* The Timeline Dot */}
              {/* The Timeline Dot */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0 rgba(212,175,55,0)" }}
                whileInView={{ scale: 1, opacity: 1, boxShadow: "0 0 20px rgba(212,175,55,0.8)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                className="absolute left-[-1px] md:left-[3px] top-4 w-8 h-8 rounded-full bg-royal-blue border-2 border-champagne-gold flex items-center justify-center z-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                  className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse"
                ></motion.div>
              </motion.div>

              {/* The Glassmorphism Event Card */}
              <div className="bg-royal-blue/30 backdrop-blur-xl border border-champagne-gold/30 p-6 md:p-8 rounded-tr-3xl rounded-bl-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-champagne-gold/60 hover:bg-royal-blue/50 transition-all duration-500 group">
                <h3 className="text-2xl md:text-3xl font-hindi text-champagne-gold mb-2 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-300">{event.title}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-[1px] w-8 bg-champagne-gold/50"></div>
                  <p className="text-[10px] md:text-xs font-sans tracking-widest text-ivory/70 uppercase">{event.time}</p>
                </div>
                <p className="text-sm md:text-base font-sans text-ivory/90 leading-relaxed font-light">
                  {event.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </motion.div>
  );
};

export default TimelineJourney;