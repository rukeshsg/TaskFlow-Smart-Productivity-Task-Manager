import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { getInitials, isOverdue, formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const SearchIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SunIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const MenuIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const XIcon       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const AlertIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

const Topbar = ({ onMenuToggle }) => {
  const { user, logout, toggleTheme }      = useAuth();
  const { tasks, setFilters, analytics }   = useTasks();
  const [search, setSearch]                = useState('');
  const [showNotifs, setShowNotifs]        = useState(false);
  const [showProfile, setShowProfile]      = useState(false);
  const navigate                           = useNavigate();
  const debouncedSearch                    = useDebounce(search, 350);
  const notifRef                           = useRef(null);
  const profileRef                         = useRef(null);

  useEffect(() => { setFilters({ search: debouncedSearch }); }, [debouncedSearch]); // eslint-disable-line

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))   setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate && (
      isOverdue(t.dueDate) || (() => {
        const d = new Date(t.dueDate); d.setHours(0,0,0,0);
        const today = new Date(); today.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
      })()
    ))
    .slice(0, 10);

  const badgeCount = (analytics?.overdueCount ?? 0) + (analytics?.dueTodayCount ?? 0);

  const dropdownStyle = {
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border-base)',
    borderRadius: 16, boxShadow: 'var(--shadow-lg)', zIndex: 50, overflow: 'hidden',
  };

  const iconBtnStyle = {
    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'transparent', border: '1px solid transparent',
    color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)', position: 'relative',
    flexShrink: 0,
  };

  return (
    <header style={{
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', gap: 12, flexShrink: 0,
      background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {/* Left: Hamburger + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <button onClick={onMenuToggle} style={{ ...iconBtnStyle, flexShrink: 0 }} aria-label="Toggle sidebar">
          <MenuIcon />
        </button>

        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none', display: 'flex' }}>
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
            style={{
              width: '100%', padding: '8px 36px', borderRadius: 10,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              transition: 'var(--transition)', fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
            onBlur={(e) =>  { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Right: action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} aria-label="Toggle theme" style={iconBtnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          {user?.theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifs((v) => !v)} aria-label={`Notifications${badgeCount > 0 ? ` (${badgeCount})` : ''}`}
            style={iconBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <BellIcon />
            {badgeCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4, width: 16, height: 16,
                background: '#f87171', borderRadius: '50%',
                fontSize: 9, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-surface)',
              }}>
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                style={{ ...dropdownStyle, width: 320 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Notifications</p>
                  {badgeCount > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {analytics?.overdueCount > 0 && `${analytics.overdueCount} overdue`}
                      {analytics?.overdueCount > 0 && analytics?.dueTodayCount > 0 && ' · '}
                      {analytics?.dueTodayCount > 0 && `${analytics.dueTodayCount} due today`}
                    </p>
                  )}
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <p style={{ fontSize: 24, marginBottom: 8 }}>🎉</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>All caught up!</p>
                    </div>
                  ) : notifications.map((task) => {
                    const overdue = isOverdue(task.dueDate);
                    return (
                      <div key={task._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-overlay)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: overdue ? '#f87171' : '#fbbf24', marginTop: 2, flexShrink: 0 }}><AlertIcon /></span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                          <p style={{ fontSize: 11, color: overdue ? '#f87171' : '#fbbf24', marginTop: 2 }}>
                            {overdue ? '⚠ Overdue' : '📅 Due today'} · {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowProfile((v) => !v)} aria-label="Profile menu"
            style={{
              width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              border: 'none', color: '#fff', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            {getInitials(user?.name)}
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                style={{ ...dropdownStyle, width: 210 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{user?.email}</p>
                </div>
                <div style={{ padding: '8px' }}>
                  {[
                    { label: '⚙️  Settings', action: () => { navigate('/profile'); setShowProfile(false); }, danger: false },
                    { label: '→  Sign Out', action: logout, danger: true },
                  ].map(({ label, action, danger }) => (
                    <button key={label} onClick={action}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: danger ? '#f87171' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                        transition: 'var(--transition)', display: 'block',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = danger ? 'rgba(248,113,113,0.08)' : 'var(--bg-overlay)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default memo(Topbar);
