import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;

      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_email', user.email);

      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Secure Gateway" description="Authorized personnel authentication portal." />
      
      <div class="min-h-screen bg-bg-secondary/40 flex items-center justify-center p-4 font-body">
        <div class="bg-white border border-border-pink rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-lg space-y-6 text-left">
          <div class="text-center space-y-2">
            <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-rose-gold">Cosmalac CMS Portal</span>
            <h1 class="text-2xl font-bold font-heading text-text-primary">Secure Access</h1>
          </div>

          <form onSubmit={handleLogin} class="space-y-4">
            {error && (
              <div class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs leading-relaxed">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                Security Email
              </label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                <input
                  type="email"
                  required
                  placeholder="name@cosmalac.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full pl-9 pr-4 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                Passphrase
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full pl-9 pr-10 py-2 border border-border-pink rounded-xl text-sm focus:outline-none focus:border-rose-gold bg-bg-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} class="animate-spin" /> Verifying...
                </>
              ) : (
                'Unlock Dashboard'
              )}
            </button>
          </form>

          <div class="text-center pt-2 border-t border-border-pink/40">
            <button
              onClick={() => navigate('/')}
              class="text-[10px] uppercase font-bold text-text-secondary hover:text-rose-gold"
            >
              ← Back to Skincare Store
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
