import { useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { getInitials } from '../../utils/helpers';

const ZapIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const GridIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const CalIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UserIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ChevronLeft  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const TrendIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

const navItems = [
  { to: '/',         icon: GridIcon, label: 'Dashboard' },
  { to: '/calendar', icon: CalIcon,  label: 'Calendar'  },
  { to: '/profile',  icon: UserIcon, label: 'Profile'   },
];

const ProgressRing = ({ percent = 0, size = 48, stroke = 4 }) => {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (Math.min(percent, 100) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--brand)" strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
};

const Sidebar = ({ isOpen, onToggle }) => {
  const { user }  = useAuth();
  const { analytics } = useTasks();
  const completion = analytics?.completionRate ?? 0;
  const total      = analytics?.total ?? 0;

  const sideW = isOpen ? 240 : 68;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onToggle}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 19, display: 'none' }}
            className="lg-hidden-backdrop" />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sideW }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed', left: 0, top: 0, height: '100%',
          zIndex: 20, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)',
          overflow: 'hidden', minWidth: sideW, maxWidth: sideW,
        }}>

        {/* Logo */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }} className="glow-sm">
            <ZapIcon />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden' }}
                className="gradient-text">
                TaskFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
                borderRadius: 11, textDecoration: 'none',
                transition: 'var(--transition)', position: 'relative',
                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: isActive ? 'var(--brand-light)' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500, fontSize: 13,
              })}>
              {({ isActive }) => (
                <>
                  <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}><Icon /></span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip */}
                  {!isOpen && (
                    <div style={{
                      position: 'absolute', left: 60, top: '50%', transform: 'translateY(-50%)',
                      background: 'var(--bg-overlay)', color: 'var(--text-primary)',
                      fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 8,
                      whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0,
                      border: '1px solid var(--border-base)', boxShadow: 'var(--shadow-md)',
                      zIndex: 100, transition: 'opacity 0.15s',
                    }} className="sidebar-tooltip">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Progress widget */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          {isOpen ? (
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 14, padding: '14px',
              border: '1px solid var(--border-subtle)', display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProgressRing percent={completion} />
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--brand-light)' }}>
                  {completion}%
                </span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Completion rate</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{total} tasks total</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <TrendIcon />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#fbbf24' }}>{user?.streak ?? 0} day streak 🔥</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
              <div style={{ position: 'relative' }}>
                <ProgressRing percent={completion} size={44} />
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--brand-light)' }}>
                  {completion}%
                </span>
              </div>
            </div>
          )}

          {/* User row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 6px 4px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>
              {getInitials(user?.name)}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ overflow: 'hidden', minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Toggle chevron */}
        <button onClick={onToggle} aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            position: 'absolute', right: -12, top: 70, width: 24, height: 24,
            borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', zIndex: 1,
            transition: 'var(--transition)',
          }}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </motion.aside>

      <style>{`
        nav a:hover .sidebar-tooltip { opacity: 1 !important; }
      `}</style>
    </>
  );
};

export default memo(Sidebar);
