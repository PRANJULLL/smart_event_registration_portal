const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
} = require('../controllers/registerController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, registerForEvent);
router.get('/user', protect, getUserRegistrations);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
