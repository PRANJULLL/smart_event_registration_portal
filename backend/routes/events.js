const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('admin'), upload.single('image'), createEvent);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
