import { memo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { KanbanColumnSkeleton } from './TaskSkeleton';

const COLUMN_META = {
  todo:       { label: 'To Do',       dot: '#94a3b8', bg: 'rgba(148,163,184,0.08)',  ring: 'rgba(148,163,184,0.25)', emptyIcon: '📋', emptyText: 'No tasks here. Add one!' },
  inProgress: { label: 'In Progress', dot: '#818cf8', bg: 'rgba(129,140,248,0.08)',  ring: 'rgba(129,140,248,0.3)',  emptyIcon: '⚡', emptyText: 'Nothing in progress yet' },
  completed:  { label: 'Completed',   dot: '#34d399', bg: 'rgba(52,211,153,0.08)',   ring: 'rgba(52,211,153,0.25)',  emptyIcon: '✅', emptyText: 'Complete tasks to see them here' },
};

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const KanbanColumn = ({ columnId, tasks, loading, onEdit, onDelete, onAdd }) => {
  const meta = COLUMN_META[columnId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 300, flexShrink: 0, height: '100%' }}>
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: meta.dot, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            {meta.label}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 99,
            background: meta.bg, color: meta.dot,
            border: `1px solid ${meta.ring}`,
          }}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onAdd(columnId)} aria-label={`Add to ${meta.label}`}
          style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
          <PlusIcon />
        </button>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="kanban-col-scroll"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', gap: 10,
              padding: '8px', borderRadius: 16, minHeight: 120,
              background: snapshot.isDraggingOver ? meta.bg : 'transparent',
              border: snapshot.isDraggingOver ? `2px dashed ${meta.ring}` : '2px dashed transparent',
              transition: 'background 0.2s, border-color 0.2s',
            }}>

            {loading ? (
              <KanbanColumnSkeleton />
            ) : tasks.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 16px', color: 'var(--text-dim)', userSelect: 'none' }}>
                <span style={{ fontSize: 32, opacity: 0.5 }}>{meta.emptyIcon}</span>
                <p style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.5 }}>{meta.emptyText}</p>
                <button onClick={() => onAdd(columnId)}
                  style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: 'var(--brand-light)', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', transition: 'var(--transition)', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}>
                  + Add task
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{ ...dragProvided.draggableProps.style }}>
                        <TaskCard
                          task={task}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          dragging={dragSnapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(KanbanColumn);
