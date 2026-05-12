const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, taskController.createTask);
router.get('/:projectId', auth, taskController.getTasksByProject);
router.put('/:id', auth, taskController.updateTaskStatus);
router.put('/edit/:id', auth, taskController.updateTask); // Changed path slightly to avoid conflict with status update
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;