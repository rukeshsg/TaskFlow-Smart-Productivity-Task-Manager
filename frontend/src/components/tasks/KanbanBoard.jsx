import { useState, useCallback, memo, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import { useTasks } from '../../context/TaskContext';
import { groupTasksByStatus } from '../../utils/helpers';
import { setOpenAddTask } from '../../pages/DashboardPage';

const COLUMN_ORDER = ['todo', 'inProgress', 'completed'];

const KanbanBoard = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, reorderTasks } = useTasks();
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingTask, setEditingTask]     = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const grouped = groupTasksByStatus(tasks);

  // Register the openAdd trigger so DashboardPage header button can open modal
  useEffect(() => {
    setOpenAddTask((status) => {
      setEditingTask(null);
      setDefaultStatus(status || 'todo');
      setModalOpen(true);
    });
    return () => setOpenAddTask(null);
  }, []);

  const handleDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcColId = source.droppableId;
    const dstColId = destination.droppableId;
    const srcList  = [...(grouped[srcColId] || [])];
    const dstList  = srcColId === dstColId ? srcList : [...(grouped[dstColId] || [])];

    const [movedTask] = srcList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: dstColId };

    if (srcColId === dstColId) {
      srcList.splice(destination.index, 0, updatedTask);
    } else {
      dstList.splice(destination.index, 0, updatedTask);
    }

    // Build full updated tasks array for optimistic update
    const reorderPayload = [];
    const updatedTasks = tasks.map((t) => {
      if (srcColId === dstColId) {
        const idx = srcList.findIndex((s) => s._id === t._id);
        if (idx !== -1) {
          reorderPayload.push({ _id: t._id, order: idx, status: srcColId });
          return { ...t, order: idx };
        }
      } else {
        const srcIdx = srcList.findIndex((s) => s._id === t._id);
        const dstIdx = dstList.findIndex((d) => d._id === t._id);
        if (srcIdx !== -1) { reorderPayload.push({ _id: t._id, order: srcIdx, status: srcColId }); return { ...t, order: srcIdx }; }
        if (dstIdx !== -1) { reorderPayload.push({ _id: t._id, order: dstIdx, status: dstColId }); return { ...t, order: dstIdx, status: dstColId }; }
      }
      return t;
    });

    await reorderTasks(reorderPayload, updatedTasks);
  }, [tasks, grouped, reorderTasks]);

  const handleAdd = (status = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
  };

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await updateTask(editingTask._id, formData);
    } else {
      await createTask({ ...formData, status: defaultStatus });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-scroll" style={{ flex: 1, display: 'flex', gap: 16, padding: '4px 2px 16px', height: '100%' }}>
          {COLUMN_ORDER.map((colId) => (
            <KanbanColumn
              key={colId}
              columnId={colId}
              tasks={grouped[colId] || []}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingTask
            ? editingTask
            : { status: defaultStatus }
        }
      />
    </div>
  );
};

export default memo(KanbanBoard);
