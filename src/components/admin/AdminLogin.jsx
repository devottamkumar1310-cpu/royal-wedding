import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../shared/MagneticButton';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-transparent text-[#F8F4E8] p-4">
      <div className="w-full max-w-md bg-stationery-gradient backdrop-blur-md border border-[#FFC300] p-8 rounded-sm shadow-luxe-strong">
        <h2 className="text-2xl font-serif text-champagne-gold mb-6 text-center uppercase tracking-widest">Royal Admin</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-champagne-gold/80 mb-1 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stationery-gradient/85 border border-[#FFC300] p-3 text-[#F8F4E8] outline-none focus:border-[#FFC300] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-champagne-gold/80 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stationery-gradient/85 border border-[#FFC300] p-3 text-[#F8F4E8] outline-none focus:border-[#FFC300] transition-colors"
              required
            />
          </div>
          <MagneticButton 
            className="w-full py-4 mt-6 bg-champagne-gold text-[#F8F4E8] uppercase tracking-widest text-sm font-semibold hover:bg-royal-blue hover:text-[#F8F4E8] transition-all duration-300 shadow-[0_4px_15px_rgba(35,57,91,0.08)]"
          >
            {loading ? 'Logging in...' : 'Enter Dashboard'}
          </MagneticButton>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;


