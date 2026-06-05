import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import MagneticButton from '../shared/MagneticButton';

const RsvpWidget = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', guests: 1, attending: true, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.attending && formData.guests < 1) {
      setFormError('Guest count must be at least 1 if attending.');
      return;
    }
    setFormError('');

    console.log("ENV URL:", import.meta.env.VITE_GOOGLE_SCRIPT_URL);
    console.log("ALL ENV VARS:", import.meta.env);
    
    const googleScriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyuX6fJn9h41iXZWxbaxzjBz0aGZ_7z9UmmKMnpvjQSXAReKC6U5CcZxutouazCr3iz/exec";
    if (!googleScriptUrl) {
      setFormError('RSVP service is not configured. Please define VITE_GOOGLE_SCRIPT_URL.');
      return;
    }

    setSubmitting(true);
    try {
      // Direct POST to Google Sheets
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // standard mode to bypass CORS issues for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_name: formData.name.trim(),
          phone: formData.phone.trim(),
          is_attending: formData.attending,
          guests_count: formData.attending ? parseInt(formData.guests, 10) : 0,
          message: formData.message.trim() || '',
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('[RsvpWidget] submit error:', error);
      setFormError('Something went wrong. Please try again.');
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
      className="w-full flex flex-col items-center pb-32 pt-8 px-4"
    >
      <h2 className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal">
        RSVP
      </h2>

      <div className="w-full max-w-lg bg-stationery-gradient p-10 md:p-16 text-center relative overflow-hidden shadow-luxe-medium rounded-sm">
        
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full scale-150">
             <circle cx="100" cy="100" r="80" fill="none" stroke="#D4922A" strokeWidth="1" strokeDasharray="4 4" />
             <circle cx="100" cy="100" r="70" fill="none" stroke="#D4922A" strokeWidth="0.5" />
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 py-10">
              <div className="w-16 h-16 mx-auto border-2 border-sage-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(156,175,136,0.1)]">
                <svg className="w-8 h-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <h3 className="text-3xl text-rose-accent font-greatvibes mb-4">Thank You</h3>
              <p className="text-[#5C3F2A]/90 font-lato tracking-wide leading-relaxed mb-8 max-w-sm mx-auto text-sm font-light">
                We have received your response and look forward to celebrating this joyous occasion with you.
              </p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', guests: 1, attending: true, message: '' }) }} className="text-rose-accent hover:text-[#D4922A] uppercase tracking-widest text-xs border-b border-rose-accent/30 pb-1 font-lato">
                Submit another response
              </button>
            </motion.div>
          ) : !showForm ? (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <h3 className="text-xl md:text-2xl font-cormorant mb-6 text-rose-accent leading-relaxed font-normal">
                Your Presence <br/> is our Privilege
              </h3>
              <p className="text-[#5C3F2A]/80 font-lato text-sm md:text-base leading-relaxed tracking-wider mb-10 font-light">
                We eagerly await your gracious presence to bless the couple and celebrate this joyous occasion.
              </p>
              <div className="flex flex-col space-y-4 items-center">
                 <MagneticButton 
                  onClick={() => setShowForm(true)}
                  className="btn-luxury px-10 py-4 uppercase tracking-widest shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 w-full relative"
                >
                  <span className="relative z-10">Digital RSVP</span>
                </MagneticButton>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative z-10 text-left space-y-4">
              <h3 className="text-lg text-rose-accent font-cormorant text-center uppercase tracking-widest mb-6 font-semibold">Digital RSVP</h3>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C3F2A]/70 mb-1 font-lato font-light">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#E0E0E0] p-3 text-[#5C3F2A] outline-none focus:border-[#D4922A] text-base rounded-md transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C3F2A]/70 mb-1 font-lato font-light">Phone</label>
                <input required pattern="[0-9]{10}" title="10 digit mobile number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-[#E0E0E0] p-3 text-[#5C3F2A] outline-none focus:border-[#D4922A] text-base rounded-md transition-colors" />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wider text-[#5C3F2A]/70 mb-1 font-lato font-light">Attending?</label>
                  <select value={formData.attending} onChange={e => setFormData({...formData, attending: e.target.value === 'true'})} className="w-full bg-white border border-[#E0E0E0] p-3 text-[#5C3F2A] outline-none focus:border-[#D4922A] text-base rounded-md transition-colors cursor-pointer">
                    <option value="true">Yes, joyfully</option>
                    <option value="false">Regretfully, no</option>
                  </select>
                </div>
                {formData.attending && (
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-[#5C3F2A]/70 mb-1 font-lato font-light">Guests</label>
                    <input type="number" min="1" max="20" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-white border border-[#E0E0E0] p-3 text-[#5C3F2A] outline-none focus:border-[#D4922A] text-base rounded-md transition-colors" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C3F2A]/70 mb-1 font-lato font-light">Message (Optional)</label>
                <textarea rows="2" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-white border border-[#E0E0E0] p-2.5 text-[#5C3F2A] outline-none focus:border-[#D4922A] text-base rounded-md transition-colors resize-none" />
              </div>

              {/* Inline error — no native alert() dialogs in luxury UI */}
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500/90 text-center py-2 border border-red-500/20 rounded px-3 bg-red-500/5 font-lato font-light"
                >
                  {formError}
                </motion.p>
              )}

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setFormError(''); }} className="flex-1 py-3 text-[#5C3F2A]/70 uppercase tracking-widest text-xs hover:text-[#5C3F2A] transition-colors font-lato font-normal">Back</button>
                <MagneticButton type="submit" className="btn-luxury flex-1 py-3 uppercase tracking-widest shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 relative">
                  <span className="relative z-10">{submitting ? 'Sending...' : 'Confirm'}</span>
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
