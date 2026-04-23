const Task = require('../models/Task');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc    Get all tasks (with filtering, search, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
      dueBefore,
      dueAfter,
      tags,
    } = req.query;

    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

    if (dueBefore || dueAfter) {
      filter.dueDate = {};
      if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Task.countDocuments(filter),
    ]);

    return paginatedResponse(res, tasks, {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get task analytics for current user
// @route   GET /api/tasks/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusCounts, priorityCounts, categoryCounts, recentActivity] = await Promise.all([
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { userId, completedAt: { $ne: null } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 7 },
      ]),
    ]);

    const total = await Task.countDocuments({ userId });
    const completed = statusCounts.find((s) => s._id === 'completed')?.count || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueTodayCount = await Task.countDocuments({
      userId,
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'completed' },
    });

    // Overdue tasks
    const overdueCount = await Task.countDocuments({
      userId,
      dueDate: { $lt: today },
      status: { $ne: 'completed' },
    });

    return successResponse(res, {
      total,
      completionRate,
      dueTodayCount,
      overdueCount,
      statusCounts: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
      priorityCounts: Object.fromEntries(priorityCounts.map((p) => [p._id, p.count])),
      categoryCounts: Object.fromEntries(categoryCounts.map((c) => [c._id, c.count])),
      recentActivity: recentActivity.map((r) => ({ date: r._id, count: r.count })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, tags, colorLabel, order } =
      req.body;

    if (!title) {
      return errorResponse(res, 'Task title is required', 400);
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      tags,
      colorLabel,
      order,
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user._id}`).emit('task:created', task);
    }

    return successResponse(res, task, 'Task created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const allowedFields = [
      'title', 'description', 'status', 'priority', 'category',
      'dueDate', 'tags', 'colorLabel', 'order',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user._id}`).emit('task:updated', task);
    }

    return successResponse(res, task, 'Task updated successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user._id}`).emit('task:deleted', { _id: req.params.id });
    }

    return successResponse(res, { _id: req.params.id }, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Reorder tasks (for drag-and-drop)
// @route   PUT /api/tasks/reorder
// @access  Private
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ _id, order, status }]

    if (!Array.isArray(tasks)) {
      return errorResponse(res, 'Invalid reorder payload', 400);
    }

    const bulkOps = tasks.map(({ _id, order, status }) => ({
      updateOne: {
        filter: { _id, userId: req.user._id },
        update: { $set: { order, status } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user._id}`).emit('task:reordered', tasks);
    }

    return successResponse(res, null, 'Tasks reordered successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getAnalytics, createTask, updateTask, deleteTask, reorderTasks };
