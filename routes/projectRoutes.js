const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware'); // Your security guard

// Protect all routes with the 'auth' middleware
router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/invite', auth, projectController.inviteMember);

module.exports = router;