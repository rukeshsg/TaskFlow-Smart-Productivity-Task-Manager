import { memo } from 'react';
import { motion } from 'framer-motion';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, formatDate, isOverdue } from '../../utils/helpers';

const EditIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const CalIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const TaskCard = ({ task, onEdit, onDelete, dragging = false }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const category = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;
  const overdue  = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={dragging ? 'dragging' : ''}
      style={{
        borderRadius: 14, padding: '14px 14px 12px',
        background: 'var(--bg-elevated)',
        border: `1px solid var(--border-base)`,
        borderLeft: `3px solid ${task.colorLabel || 'var(--brand)'}`,
        cursor: 'grab', userSelect: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => { if (!dragging) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Hover action buttons (absolutely positioned) */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.15s' }}
        className="task-actions">
        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          aria-label="Edit task"
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(129,140,248,0.12)', border: 'none', cursor: 'pointer', color: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(129,140,248,0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(129,140,248,0.12)'}>
          <EditIcon />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
          aria-label="Delete task"
          style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(248,113,113,0.1)', border: 'none', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.22)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}>
          <TrashIcon />
        </button>
      </div>

      {/* Category + Priority */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingRight: 60 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
          color: category.color, background: `${category.color}15`,
        }}>
          {category.icon} {category.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          color: priority.color, background: priority.bg, marginLeft: 'auto',
        }}>
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <p style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 6,
        color: task.status === 'completed' ? 'var(--text-dim)' : 'var(--text-primary)',
        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99,
              background: 'rgba(99,102,241,0.12)', color: 'var(--brand-light)',
            }}>#{tag}</span>
          ))}
          {task.tags.length > 3 && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: due date */}
      {task.dueDate && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500,
          paddingTop: 8, borderTop: '1px solid var(--border-subtle)', marginTop: 4,
          color: overdue ? '#f87171' : 'var(--text-muted)',
        }}>
          <CalIcon />
          {overdue && '⚠ '}
          {formatDate(task.dueDate)}
        </div>
      )}

      <style>{`.task-card-wrap:hover .task-actions { opacity: 1 !important; }`}</style>
    </motion.div>
  );
};

// Wrap with hover-trigger class
const TaskCardWrapper = (props) => (
  <div className="task-card-wrap" style={{ position: 'relative' }}
    onMouseEnter={(e) => { const el = e.currentTarget.querySelector('.task-actions'); if (el) el.style.opacity = 1; }}
    onMouseLeave={(e) => { const el = e.currentTarget.querySelector('.task-actions'); if (el) el.style.opacity = 0; }}>
    <TaskCard {...props} />
  </div>
);

export default memo(TaskCardWrapper);
