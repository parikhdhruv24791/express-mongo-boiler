const router = require('express').Router();
const userController = require('../controllers/userController');

// POST new user route (optional, everyone has access)
router.post('/api/users', userController.createUser);

// GET current route (required, only authenticated users have access)
router.get('/api/users/current', userController.getCurrentUser);

module.exports = router;
