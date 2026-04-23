import { memo } from 'framer-motion';

const TaskSkeleton = () => (
  <div style={{ borderRadius: 14, padding: 14, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', gap: 6 }}>
      <div className="skeleton" style={{ height: 20, width: 64, borderRadius: 99 }} />
      <div className="skeleton" style={{ height: 20, width: 52, borderRadius: 99, marginLeft: 'auto' }} />
    </div>
    <div className="skeleton" style={{ height: 14, width: '90%' }} />
    <div className="skeleton" style={{ height: 14, width: '70%' }} />
    <div className="skeleton" style={{ height: 12, width: '45%', marginTop: 4 }} />
  </div>
);

const KanbanColumnSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}
  </div>
);

export { TaskSkeleton, KanbanColumnSkeleton };
