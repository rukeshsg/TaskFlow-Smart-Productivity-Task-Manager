import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRIORITY_CONFIG, STATUS_CONFIG, CATEGORY_CONFIG, COLOR_LABELS } from '../../utils/helpers';

const XIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TagIcon  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

const FIELD_GROUPS = [
  { key: 'status',   label: 'Status',   options: Object.entries(STATUS_CONFIG).map(([v,c]) => ({ value: v, label: c.label })) },
  { key: 'priority', label: 'Priority', options: Object.entries(PRIORITY_CONFIG).map(([v,c]) => ({ value: v, label: c.label })) },
  { key: 'category', label: 'Category', options: Object.entries(CATEGORY_CONFIG).map(([v,c]) => ({ value: v, label: `${c.icon} ${c.label}` })) },
];

const defaultForm = {
  title: '', description: '', status: 'todo', priority: 'medium',
  category: 'personal', dueDate: '', tags: [], colorLabel: '#6366f1',
};

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 10,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-base)',
  color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function TaskModal({ open, onClose, onSubmit, initialData = null }) {
  const [form, setForm]         = useState(defaultForm);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm(initialData
        ? {
            ...defaultForm, ...initialData,
            dueDate: initialData.dueDate
              ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
            tags: initialData.tags || [],
          }
        : defaultForm
      );
      setTagInput('');
      setTimeout(() => firstRef.current?.focus(), 60);
    }
  }, [open, initialData]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const focusStyle = { borderColor: 'var(--brand)', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)' };

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            role="dialog" aria-modal="true" aria-label={initialData?.title ? 'Edit Task' : 'Create Task'}
            style={{
              position: 'relative', width: '100%', maxWidth: 520, zIndex: 1,
              background: 'var(--bg-surface)', border: '1px solid var(--border-base)',
              borderRadius: 20, boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
            }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>
                  {initialData?.title ? '✏️ Edit Task' : '✨ New Task'}
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {initialData?.title ? 'Update task details' : 'Fill in the details below'}
                </p>
              </div>
              <button onClick={onClose} aria-label="Close"
                style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-overlay)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <XIcon />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit}
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '72vh', overflowY: 'auto' }}>

              {/* Title */}
              <div>
                <label style={labelStyle}>Title *</label>
                <input ref={firstRef} type="text" placeholder="What needs to be done?"
                  value={form.title} onChange={set('title')} required
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} placeholder="Add more context..." value={form.description}
                  onChange={set('description')}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 80 }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              {/* Status / Priority / Category grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {FIELD_GROUPS.map(({ key, label, options }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <select value={form[key]} onChange={set(key)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }}>
                      {options.map(({ value, label: l }) => (
                        <option key={value} value={value} style={{ background: 'var(--bg-elevated)' }}>{l}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Due Date */}
              <div>
                <label style={labelStyle}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={set('dueDate')}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }} />
              </div>

              {/* Color Label */}
              <div>
                <label style={labelStyle}>Color Label</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {COLOR_LABELS.map((color) => (
                    <button key={color} type="button" onClick={() => setForm((f) => ({ ...f, colorLabel: color }))}
                      aria-label={`Color ${color}`}
                      style={{
                        width: 28, height: 28, borderRadius: 8, background: color, border: 'none', cursor: 'pointer',
                        outline: form.colorLabel === color ? `3px solid ${color}` : '3px solid transparent',
                        outlineOffset: 2, transition: 'transform 0.15s, outline 0.15s',
                        transform: form.colorLabel === color ? 'scale(1.15)' : 'scale(1)',
                      }} />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TagIcon /> Tags
                </label>
                {form.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {form.tags.map((tag) => (
                      <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: 'var(--brand-light)' }}>
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0, opacity: 0.7 }}>
                          <XIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="Add a tag, press Enter..." value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }} />
                  <button type="button" onClick={addTag}
                    style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: 'var(--brand-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}>
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={onClose}
                  style={{ flex: 1, padding: '11px', borderRadius: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'var(--transition)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-overlay)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}>
                  Cancel
                </button>
                <motion.button type="submit" disabled={submitting || !form.title.trim()}
                  whileHover={{ scale: (submitting || !form.title.trim()) ? 1 : 1.01 }}
                  whileTap={{ scale: (submitting || !form.title.trim()) ? 1 : 0.98 }}
                  style={{
                    flex: 1.5, padding: '11px', borderRadius: 11,
                    background: (submitting || !form.title.trim()) ? 'rgba(99,102,241,0.4)' : 'var(--brand)',
                    border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                    cursor: (submitting || !form.title.trim()) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: (submitting || !form.title.trim()) ? 'none' : 'var(--shadow-glow-sm)',
                  }}>
                  {submitting ? (
                    <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  ) : (initialData?.title ? '→ Update Task' : '→ Create Task')}
                </motion.button>
              </div>
            </form>
          </motion.div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
