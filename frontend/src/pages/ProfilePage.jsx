import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const UserIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LockIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SunIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const TrendIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const SaveIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

const inputClass = { width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', transition: 'var(--transition)' };
const labelClass = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 6 };

const ProfilePage = () => {
  const { user, updateUser, toggleTheme, logout } = useAuth();
  const { analytics } = useTasks();
  const [name, setName]           = useState(user?.name || '');
  const [avatar, setAvatar]       = useState(user?.avatar || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [savingPw, setSavingPw]   = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({ name, avatar });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      const { authApi } = await import('../api/authApi');
      await authApi.changePassword({ currentPassword: currentPw, newPassword: newPw });
      toast.success('Password changed!');
      setCurrentPw(''); setNewPw('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const categoryBreakdown = analytics?.categoryCounts || {};
  const total = analytics?.total || 1;

  const sectionStyle = { background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' };
  const sectionHeader = { padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      <div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>⚙️ Profile & Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Avatar + stats card */}
      <div style={{ ...sectionStyle, padding: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative' }}>
          {avatar ? (
            <img src={avatar} alt="Avatar" style={{ width: 84, height: 84, borderRadius: 20, objectFit: 'cover', border: '2px solid rgba(99,102,241,0.4)' }} />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', boxShadow: 'var(--shadow-glow-sm)' }}>
              {getInitials(user?.name)}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#fbbf24' }}><TrendIcon /></span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>{user?.streak ?? 0} day streak 🔥</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{analytics?.completionRate ?? 0}%</span> completion rate
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile */}
      <div style={sectionStyle}>
        <div style={sectionHeader}><span style={{ color: 'var(--brand-light)' }}><UserIcon /></span> Profile Details</div>
        <form onSubmit={handleSaveProfile} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelClass}>Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputClass} placeholder="Your name"
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'} />
          </div>
          <div>
            <label style={labelClass}>Avatar URL</label>
            <input type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} style={inputClass} placeholder="https://..."
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'} />
          </div>
          <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'var(--brand)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', transition: 'var(--transition)' }}>
            <SaveIcon />
            {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </form>
      </div>

      {/* Appearance */}
      <div style={sectionStyle}>
        <div style={sectionHeader}><span style={{ color: 'var(--cyan)' }}>{user?.theme === 'dark' ? <MoonIcon /> : <SunIcon />}</span> Appearance</div>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Theme</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Currently: {user?.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode</p>
          </div>
          <button onClick={toggleTheme}
            style={{ padding: '10px 16px', borderRadius: 10, background: 'var(--bg-overlay)', border: '1px solid var(--border-base)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-overlay)'}>
            Switch to {user?.theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div style={sectionStyle}>
        <div style={sectionHeader}><span style={{ color: '#f472b6' }}><LockIcon /></span> Change Password</div>
        <form onSubmit={handleChangePassword} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelClass}>Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={inputClass} placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'} />
          </div>
          <div>
            <label style={labelClass}>New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputClass} placeholder="Min. 6 characters"
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'} />
          </div>
          <motion.button type="submit" disabled={savingPw || !currentPw || !newPw} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'var(--bg-overlay)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, border: '1px solid var(--border-base)', cursor: (savingPw || !currentPw || !newPw) ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', transition: 'var(--transition)' }}>
            🔒 {savingPw ? 'Updating...' : 'Update Password'}
          </motion.button>
        </form>
      </div>

      {/* Danger zone */}
      <div style={{ ...sectionStyle, borderColor: 'rgba(248,113,113,0.3)' }}>
        <div style={{ ...sectionHeader, borderBottomColor: 'rgba(248,113,113,0.2)', color: '#f87171' }}>⚠️ Danger Zone</div>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Sign out</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Log out of your account on this device</p>
          </div>
          <button onClick={logout}
            style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}>
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProfilePage);
