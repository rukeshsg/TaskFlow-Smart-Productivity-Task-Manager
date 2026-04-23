const express = require('express');
const router = express.Router();
const {
  getTasks,
  getAnalytics,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

router.get('/analytics', getAnalytics);
router.put('/reorder', reorderTasks);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
