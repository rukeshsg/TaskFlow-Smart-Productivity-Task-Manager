import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { taskApi } from '../api/taskApi';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useSocket } from '../hooks/useSocket';

const TaskContext = createContext(null);

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'ADD_TASK':
      // Avoid duplicate if socket fires and API already added
      if (state.tasks.some((t) => t._id === action.payload._id)) return state;
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, loading: true };
    default:
      return state;
  }
};

const initialState = {
  tasks: [],
  loading: true,
  analytics: null,
  filters: { priority: '', category: '', search: '', sortBy: 'order', sortOrder: 'asc' },
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { token } = useAuth();
  const socket = useSocket(token);
  // Use a ref to avoid stale closure in fetchTasks
  const filtersRef = useRef(state.filters);
  filtersRef.current = state.filters;

  const fetchTasks = useCallback(async (overrides = {}) => {
    if (!token) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = { ...filtersRef.current, ...overrides };
      // Strip empty string values so backend doesn't receive them
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) {
          delete params[k];
        }
      });
      const { data } = await taskApi.getTasks(params);
      dispatch({ type: 'SET_TASKS', payload: data.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await taskApi.getAnalytics();
      dispatch({ type: 'SET_ANALYTICS', payload: data.data });
    } catch { /* silent */ }
  }, [token]);

  // Initial load when authenticated
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchAnalytics();
    }
  }, [token, fetchTasks, fetchAnalytics]);

  // Re-fetch when filters change
  useEffect(() => {
    if (token) fetchTasks();
  }, [state.filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Socket.io real-time events
  useEffect(() => {
    if (!socket) return;

    const onCreated = (task) => {
      dispatch({ type: 'ADD_TASK', payload: task });
      fetchAnalytics();
    };
    const onUpdated = (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task });
      fetchAnalytics();
    };
    const onDeleted = ({ _id }) => {
      dispatch({ type: 'DELETE_TASK', payload: _id });
      fetchAnalytics();
    };
    const onReordered = () => {
      fetchTasks();
    };

    socket.on('task:created',   onCreated);
    socket.on('task:updated',   onUpdated);
    socket.on('task:deleted',   onDeleted);
    socket.on('task:reordered', onReordered);

    return () => {
      socket.off('task:created',   onCreated);
      socket.off('task:updated',   onUpdated);
      socket.off('task:deleted',   onDeleted);
      socket.off('task:reordered', onReordered);
    };
  }, [socket, fetchAnalytics, fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const { data } = await taskApi.createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: data.data });
      toast.success('Task created! ✅');
      fetchAnalytics();
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const { data } = await taskApi.updateTask(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: data.data });
      toast.success('Task updated!');
      fetchAnalytics();
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id }); // optimistic
    try {
      await taskApi.deleteTask(id);
      toast.success('Task deleted');
      fetchAnalytics();
    } catch (err) {
      // Rollback by refetching
      fetchTasks();
      toast.error(err.response?.data?.message || 'Failed to delete task');
      throw err;
    }
  };

  const reorderTasks = async (reorderData, optimisticTasks) => {
    dispatch({ type: 'REORDER_TASKS', payload: optimisticTasks });
    try {
      await taskApi.reorderTasks({ tasks: reorderData });
    } catch {
      toast.error('Failed to save order');
      fetchTasks();
    }
  };

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        analytics: state.analytics,
        filters: state.filters,
        fetchTasks,
        fetchAnalytics,
        createTask,
        updateTask,
        deleteTask,
        reorderTasks,
        setFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
