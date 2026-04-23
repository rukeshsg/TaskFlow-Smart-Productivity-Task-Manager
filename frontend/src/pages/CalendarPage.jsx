import { useState, useMemo, memo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { PRIORITY_CONFIG } from '../utils/helpers';
import TaskModal from '../components/tasks/TaskModal';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS },
});

const CalendarPage = () => {
  const { tasks, createTask, updateTask } = useTasks();
  const [selectedTask, setSelectedTask]  = useState(null);
  const [modalOpen, setModalOpen]        = useState(false);
  const [newSlotDate, setNewSlotDate]    = useState(null);

  const events = useMemo(() =>
    tasks
      .filter((t) => t.dueDate)
      .map((t) => ({
        id:    t._id,
        title: t.title,
        start: parseISO(t.dueDate),
        end:   parseISO(t.dueDate),
        resource: t,
      })), [tasks]);

  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = (event) => {
    const priority = PRIORITY_CONFIG[event.resource.priority] || PRIORITY_CONFIG.medium;
    return {
      style: {
        backgroundColor: priority.color,
        border: 'none',
        borderRadius: '8px',
        fontSize: '11px',
        padding: '3px 8px',
        fontWeight: 700,
        opacity: event.resource.status === 'completed' ? 0.5 : 1,
        color: '#fff',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
    setNewSlotDate(null);
    setModalOpen(true);
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedTask(null);
    setNewSlotDate(start);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, formData);
    } else {
      const dateStr = newSlotDate ? newSlotDate.toISOString().split('T')[0] : '';
      await createTask({ ...formData, dueDate: dateStr });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>📅 Calendar</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          {events.length} task{events.length !== 1 ? 's' : ''} with due dates
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
        {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: v.color }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: v.color }} />
            {v.label}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 16, overflow: 'hidden' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          views={['month', 'week', 'agenda']}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          tooltipAccessor={(e) => `${e.title} — ${e.resource.priority} priority`}
        />
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTask || (newSlotDate ? { dueDate: newSlotDate.toISOString().split('T')[0] } : null)}
      />
    </motion.div>
  );
};

export default memo(CalendarPage);
