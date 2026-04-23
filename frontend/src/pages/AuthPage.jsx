import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#brandGrad)">
    <defs>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const featurePills = [
  { id: 1, text: 'Real-time Sync',    icon: '⚡', top: '10%', left: '5%' },
  { id: 2, text: 'Smart Kanban',      icon: '📋', top: '45%', right: '10%' },
  { id: 3, text: 'Team Analytics',    icon: '📈', top: '80%', left: '15%' },
];

export default function AuthPage() {
  const [mode, setMode]           = useState('login');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, register }       = useAuth();
  const navigate                  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        if (!name.trim()) { toast.error('Name is required'); setSubmitting(false); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); setSubmitting(false); return; }
        await register({ name, email, password });
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isMobile = window.innerWidth < 1024;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080d18', color: '#fff', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ─── LEFT PANEL (Branding) ─── */}
      {!isMobile && (
        <div style={{ position: 'relative', width: '50%', background: '#0a0f1c', borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Abstract Animated Glows */}
          <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: '#4f46e5', filter: 'blur(100px)', opacity: 0.3, mixBlendMode: 'screen' }} />
          <motion.div animate={{ x: [0, -40, 0], y: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: '#9333ea', filter: 'blur(120px)', opacity: 0.2, mixBlendMode: 'screen' }} />
          
          {/* Grid Overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Content Wrapper */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '64px' }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)' }}>
                <ZapIcon />
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'linear-gradient(to bottom right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TaskFlow
              </span>
            </div>

            {/* Center Text */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: 'auto 0' }}>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em', marginBottom: 24 }}>
                Organize <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>everything.</span><br/>
                Achieve <span style={{ background: 'linear-gradient(to right, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>anything.</span>
              </motion.h1>
              
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                style={{ fontSize: 18, color: '#94a3b8', fontWeight: 500, lineHeight: 1.6, maxWidth: 450 }}>
                The smart productivity suite designed for high-performing teams and ambitious individuals. Experience workflow nirvana.
              </motion.p>

              {/* Floating Pills */}
              <div style={{ position: 'relative', height: 250, width: '100%', marginTop: 40 }}>
                {featurePills.map((pill, i) => (
                  <motion.div key={pill.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                    transition={{ opacity: { duration: 0.5, delay: 0.2 + (i * 0.1) }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 } }}
                    style={{ position: 'absolute', top: pill.top, left: pill.left, right: pill.right, padding: '12px 20px', borderRadius: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 12, width: 'fit-content', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    <span style={{ fontSize: 20 }}>{pill.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.02em' }}>{pill.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ fontSize: 14, fontWeight: 500, color: '#64748b', letterSpacing: '0.02em' }}>
              © {new Date().getFullYear()} TaskFlow Inc. · Design-driven productivity
            </div>
          </div>
        </div>
      )}

      {/* ─── RIGHT PANEL (Auth Form) ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 32 : 80, position: 'relative', background: '#080d18' }}>
        
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <ZapIcon />
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TaskFlow</span>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
          
          <div style={{ marginBottom: 40, textAlign: isMobile ? 'center' : 'left' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
              {mode === 'login' ? 'Enter your details to access your workspace.' : 'Join thousands of users organizing their life.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', padding: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, marginBottom: 32, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 6, bottom: 6, width: 'calc(50% - 6px)', background: '#1e293b', borderRadius: 12, transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid rgba(255,255,255,0.05)', transform: mode === 'login' ? 'translateX(0)' : 'translateX(100%)', left: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
            
            <button onClick={() => setMode('login')} style={{ flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 600, position: 'relative', zIndex: 10, background: 'none', border: 'none', color: mode === 'login' ? '#fff' : '#94a3b8', cursor: 'pointer', transition: 'color 0.2s', fontFamily: 'inherit' }}>
              Sign In
            </button>
            <button onClick={() => setMode('register')} style={{ flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 600, position: 'relative', zIndex: 10, background: 'none', border: 'none', color: mode === 'register' ? '#fff' : '#94a3b8', cursor: 'pointer', transition: 'color 0.2s', fontFamily: 'inherit' }}>
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form key={mode} initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }} transition={{ duration: 0.2, ease: "easeInOut" }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {mode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required
                    style={{ width: '100%', padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}
                    onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Email Address</label>
                <input type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  {mode === 'login' && <button type="button" style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Forgot password?</button>}
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder={mode === 'login' ? '••••••••' : 'Min. 6 characters'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    style={{ width: '100%', padding: '14px 48px 14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}
                    onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={submitting} whileHover={{ scale: submitting ? 1 : 1.02 }} whileTap={{ scale: submitting ? 1 : 0.98 }}
                style={{ width: '100%', padding: '16px', marginTop: 16, borderRadius: 12, fontWeight: 700, fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.3s', cursor: submitting ? 'not-allowed' : 'pointer', background: submitting ? 'rgba(99,102,241,0.5)' : '#4f46e5', border: 'none', boxShadow: submitting ? 'none' : '0 0 30px rgba(99,102,241,0.3)', fontFamily: 'inherit' }}
                onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.5)'; } }}
                onMouseLeave={(e) => { if (!submitting) { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.3)'; } }}>
                {submitting ? (
                  <>
                    <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    {mode === 'login' ? 'Authenticating...' : 'Creating Account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In →' : 'Create Account →'
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
