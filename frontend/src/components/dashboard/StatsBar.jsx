import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';

const icons = {
  total:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  completion: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  dueToday:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  overdue:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const StatCard = ({ icon, label, value, color, subtext, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="card-hover"
    style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16,
    }}>
    <div style={{
      width: 46, height: 46, borderRadius: 13, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${color}15`, color,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
      {subtext && <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>{subtext}</p>}
    </div>
  </motion.div>
);

const StatsBar = () => {
  const { analytics } = useTasks();
  if (!analytics) return null;

  const stats = [
    { icon: icons.total,      label: 'Total Tasks',  value: analytics.total ?? 0,              color: '#818cf8', subtext: 'all boards',           delay: 0 },
    { icon: icons.completion, label: 'Completion',   value: `${analytics.completionRate ?? 0}%`, color: '#34d399', subtext: `${analytics.statusCounts?.completed ?? 0} done`, delay: 0.07 },
    { icon: icons.dueToday,   label: 'Due Today',    value: analytics.dueTodayCount ?? 0,      color: '#fbbf24', subtext: 'need attention',        delay: 0.14 },
    { icon: icons.overdue,    label: 'Overdue',      value: analytics.overdueCount ?? 0,       color: '#f87171', subtext: analytics.overdueCount > 0 ? '⚠ action needed' : '✅ on track', delay: 0.21 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
      {stats.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
};

export default memo(StatsBar);
