import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d))    return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

export const isOverdue = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isPast(d) && !isToday(d);
};

export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  ring: '#34d399' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', ring: '#fbbf24' },
  high:   { label: 'High',   color: '#fb7185', bg: 'rgba(251,113,133,0.12)',ring: '#fb7185' },
};

export const STATUS_CONFIG = {
  todo:       { label: 'Todo',        color: '#94a3b8' },
  inProgress: { label: 'In Progress', color: '#818cf8' },
  completed:  { label: 'Completed',   color: '#34d399' },
};

export const CATEGORY_CONFIG = {
  work:     { label: 'Work',     icon: '💼', color: '#818cf8' },
  study:    { label: 'Study',    icon: '📚', color: '#22d3ee' },
  personal: { label: 'Personal', icon: '✨', color: '#f472b6' },
  other:    { label: 'Other',    icon: '📌', color: '#94a3b8' },
};

export const COLOR_LABELS = [
  '#6366f1', '#22d3ee', '#34d399', '#fbbf24',
  '#fb7185', '#a78bfa', '#f472b6', '#38bdf8',
];

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const groupTasksByStatus = (tasks) => ({
  todo:       tasks.filter((t) => t.status === 'todo'),
  inProgress: tasks.filter((t) => t.status === 'inProgress'),
  completed:  tasks.filter((t) => t.status === 'completed'),
});
