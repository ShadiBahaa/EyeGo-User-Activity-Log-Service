const express = require('express');
const LogController = require('../controllers/LogController');

const router = express.Router();

// Get all logs
router.get('/', LogController.getAllLogs);

// Get a log by ID
router.get('/:id', LogController.getLogById);

// Create a new log
router.post('/', LogController.createLog);

// Delete a log by ID
router.delete('/:id', LogController.deleteLog);

module.exports = router;