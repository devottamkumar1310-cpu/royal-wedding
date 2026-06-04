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
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-royal-blue text-ivory p-4">
      <div className="w-full max-w-md bg-royal-blue/60 backdrop-blur-md border border-champagne-gold/50 p-8 rounded-sm shadow-[0_0_40px_rgba(212,175,55,0.15)]">
        <h2 className="text-2xl font-serif text-champagne-gold mb-6 text-center uppercase tracking-widest">Royal Admin</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-champagne-gold/80 mb-1 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-champagne-gold/80 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-champagne-gold/30 p-3 text-ivory outline-none focus:border-champagne-gold transition-colors"
              required
            />
          </div>
          <MagneticButton 
            className="w-full py-4 mt-6 bg-champagne-gold text-royal-blue uppercase tracking-widest text-sm font-semibold hover:bg-ivory transition-colors duration-500"
          >
            {loading ? 'Logging in...' : 'Enter Dashboard'}
          </MagneticButton>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
