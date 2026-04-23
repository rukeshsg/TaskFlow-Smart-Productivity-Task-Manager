import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import StatsBar from '../components/dashboard/StatsBar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const FilterIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const XIcon       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PlusIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const FILTER_OPTIONS = {
  priority: [
    { value: '', label: 'All Priority' },
    { value: 'high',   label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low',    label: '🟢 Low' },
  ],
  category: [
    { value: '',         label: 'All Category' },
    { value: 'work',     label: '💼 Work' },
    { value: 'study',    label: '📚 Study' },
    { value: 'personal', label: '✨ Personal' },
    { value: 'other',    label: '📌 Other' },
  ],
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// Expose addTask trigger from KanbanBoard via ref
let _openAddTask = null;
export const setOpenAddTask = (fn) => { _openAddTask = fn; };

const DashboardPage = () => {
  const { user }   = useAuth();
  const { filters, setFilters, tasks } = useTasks();
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = !!(filters.priority || filters.category);

  const clearFilters = () => setFilters({ priority: '', category: '' });

  const selectStyle = {
    padding: '8px 12px', borderRadius: 9, fontSize: 12, fontWeight: 600,
    background: 'var(--bg-elevated)', border: '1px solid var(--border-base)',
    color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
    fontFamily: 'inherit', transition: 'var(--transition)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div>
          <motion.h1 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} across all boards
          </motion.p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Filter toggle */}
          <button onClick={() => setShowFilters((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              background: (showFilters || hasFilters) ? 'rgba(99,102,241,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${(showFilters || hasFilters) ? 'rgba(99,102,241,0.3)' : 'var(--border-base)'}`,
              color: (showFilters || hasFilters) ? 'var(--brand-light)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}>
            <FilterIcon />
            Filters
            {hasFilters && (
              <span style={{ width: 16, height: 16, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 800 }}>!</span>
            )}
          </button>

          {/* Quick Add */}
          <button onClick={() => _openAddTask?.('todo')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              background: 'var(--brand)', border: 'none', color: '#fff',
              boxShadow: 'var(--shadow-glow-sm)', transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-light)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-sm)'; }}>
            <PlusIcon /> New Task
          </button>
        </div>
      </div>

      {/* Filter row */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
          {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
            <select key={key} value={filters[key] || ''} onChange={(e) => setFilters({ [key]: e.target.value })} style={selectStyle}>
              {options.map(({ value, label }) => (
                <option key={value} value={value} style={{ background: 'var(--bg-elevated)' }}>{label}</option>
              ))}
            </select>
          ))}
          {hasFilters && (
            <button onClick={clearFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 9, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'var(--transition)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}>
              <XIcon /> Clear filters
            </button>
          )}
        </motion.div>
      )}

      {/* Stats */}
      <StatsBar />

      {/* Kanban */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <KanbanBoard />
      </div>
    </div>
  );
};

export default memo(DashboardPage);
