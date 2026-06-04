import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import MagneticButton from '../shared/MagneticButton';

const RsvpWidget = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', guests: 1, attending: true, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phoneNumber = "919876543210"; 
  const waMessage = "Namaste! We are delighted to confirm our presence at the Royal Wedding Celebration.";
  
  const handleWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client side validation
    const phoneRegex = /^[0-9]{10}$/; // Basic 10-digit validation to be safe
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.attending && formData.guests < 1) {
      alert('Guest count must be at least 1 if attending.');
      return;
    }

    setSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!GOOGLE_SCRIPT_URL) {
        throw new Error("Google Script URL is missing.");
      }
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          guests_count: formData.attending ? parseInt(formData.guests) : 0,
          is_attending: formData.attending,
          message: formData.message
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Error submitting RSVP');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      key="rsvp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center justify-center pb-32 pt-4 px-4"
    >
      <div className="w-full max-w-lg bg-royal-blue/30 backdrop-blur-xl border-y-2 md:border-2 border-champagne-gold/50 p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)]">
        
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full scale-150">
             <circle cx="100" cy="100" r="80" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 4" />
             <circle cx="100" cy="100" r="70" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 py-10">
              <div className="w-16 h-16 mx-auto border-2 border-champagne-gold rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <svg className="w-8 h-8 text-champagne-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl text-champagne-gold font-serif mb-4">Thank You</h3>
              <p className="text-ivory/90 font-sans tracking-wide leading-relaxed mb-8 max-w-sm mx-auto">
                We have received your response and look forward to celebrating this joyous occasion with you.
              </p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', guests: 1, attending: true, message: '' }) }} className="text-champagne-gold/70 hover:text-champagne-gold uppercase tracking-widest text-xs border-b border-champagne-gold/30 pb-1">
                Submit another response
              </button>
            </motion.div>
          ) : !showForm ? (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <h2 className="text-3xl md:text-5xl text-champagne-gold font-serif mb-6 drop-shadow-md">
                Your Presence <br/> is our Privilege
              </h2>
              <p className="text-ivory/80 font-sans text-sm md:text-base leading-relaxed tracking-wider mb-10">
                We eagerly await your gracious presence to bless the couple and celebrate this joyous occasion.
              </p>
              <div className="flex flex-col space-y-4 items-center">
                <MagneticButton 
                  onClick={() => setShowForm(true)}
                  className="px-10 py-4 bg-champagne-gold text-royal-blue uppercase tracking-widest text-sm font-semibold hover:bg-ivory transition-colors duration-500 w-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  Digital RSVP
                </MagneticButton>
                <button onClick={handleWhatsApp} className="text-champagne-gold/70 hover:text-champagne-gold uppercase tracking-widest text-xs transition-colors">
                  Or confirm via WhatsApp
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative z-10 text-left space-y-4">
              <h3 className="text-xl text-champagne-gold font-serif text-center uppercase tracking-widest mb-6">Digital RSVP</h3>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold text-lg" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">Phone</label>
                <input required pattern="[0-9]{10}" title="10 digit mobile number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold text-lg" />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">Attending?</label>
                  <select value={formData.attending} onChange={e => setFormData({...formData, attending: e.target.value === 'true'})} className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold appearance-none text-lg">
                    <option value="true">Yes, joyfully</option>
                    <option value="false">Regretfully, no</option>
                  </select>
                </div>
                {formData.attending && (
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">Guests</label>
                    <input type="number" min="1" max="20" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-black/20 border-b border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold text-lg" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">Message (Optional)</label>
                <textarea rows="2" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black/20 border-b border-champagne-gold/30 p-2 text-ivory outline-none focus:border-champagne-gold resize-none" />
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-ivory/70 uppercase tracking-widest text-xs hover:text-ivory transition-colors">Back</button>
                <MagneticButton className="flex-1 py-3 bg-champagne-gold text-royal-blue uppercase tracking-widest text-xs font-semibold hover:bg-ivory transition-colors duration-500">
                  {submitting ? 'Sending...' : 'Confirm'}
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RsvpWidget;
