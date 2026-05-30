const express = require('express');
const router = express.Router();
const {
  getStats,
  getRegistrations,
  scanTicket,
  exportCSV,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// Protect all routes here to Admin role only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/registrations', getRegistrations);
router.post('/scan', scanTicket);
router.get('/export', exportCSV);

module.exports = router;
