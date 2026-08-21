import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Loader2, ArrowRight, RotateCcw, CheckCircle2, Lock } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { SEO } from '../../components/SEO';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const publicStoreUrl = import.meta.env.VITE_PUBLIC_STORE_URL || 'http://localhost:5173';

  // Timer Countdown for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Request OTP Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await axiosInstance.post('/auth/request-otp', { email });
      setInfoMessage(res.data?.message || 'Verification code sent to your email.');
      setStep('otp');
      setCountdown(60); // 60s cooldown
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
      const { token, refreshToken, user } = res.data;

      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_email', user.email);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, refreshToken, user } = res.data;

      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_email', user.email);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Verify email and passphrase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Secure Gateway" description="Authorized personnel authentication portal." />

      <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-4 font-body">
        <div className="bg-white border border-[#D8D2C8] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl space-y-6 text-left">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-rose-gold block">
              Cosmalac Control Center
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-[#121110]">
              {step === 'otp' ? 'Enter Passcode' : 'Secure Sign In'}
            </h1>
            <p className="text-xs text-[#57534E] font-medium">
              {step === 'otp'
                ? `6-digit security code sent to ${email}`
                : 'Authentication portal for authorized personnel only.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs leading-relaxed font-medium">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* STEP 1: EMAIL INPUT */}
          {step === 'email' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  Authorized Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57534E]" size={14} />
                  <input
                    type="email"
                    required
                    placeholder="admin@cosmalac.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D8D2C8] rounded-xl text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold bg-[#F1EFE7]/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#121110] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Dispatching Code...
                  </>
                ) : (
                  <>
                    Send One-Time Code <ArrowRight size={13} />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="text-[11px] text-[#57534E] hover:text-rose-gold font-semibold transition-colors"
                >
                  Use passphrase instead
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  6-Digit One-Time Passcode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57534E]" size={14} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D8D2C8] rounded-xl text-center text-base tracking-[0.3em] font-extrabold text-[#121110] focus:outline-none focus:border-rose-gold bg-[#F1EFE7]/40 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-[#121110] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying Code...
                  </>
                ) : (
                  'Verify & Unlock Dashboard'
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setError(null);
                  }}
                  className="text-[#57534E] hover:text-[#121110] font-semibold"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="text-rose-gold hover:underline font-bold disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                >
                  <RotateCcw size={11} /> {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PASSPHRASE FALLBACK */}
          {step === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  Security Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57534E]" size={14} />
                  <input
                    type="email"
                    required
                    placeholder="admin@cosmalac.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D8D2C8] rounded-xl text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold bg-[#F1EFE7]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  Passphrase
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57534E]" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D8D2C8] rounded-xl text-xs font-bold text-[#121110] focus:outline-none focus:border-rose-gold bg-[#F1EFE7]/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#121110] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  'Sign In with Passphrase'
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-[11px] text-rose-gold hover:underline font-semibold"
                >
                  ← Return to Email OTP login
                </button>
              </div>
            </form>
          )}

          {/* Footer Backlink */}
          <div className="text-center pt-2 border-t border-[#D8D2C8]/60">
            <a
              href={publicStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase font-bold text-[#57534E] hover:text-rose-gold inline-flex items-center gap-1 transition-colors"
            >
              ← Back to Skincare Store
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
