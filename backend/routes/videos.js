const express = require('express');
const router = express.Router();
const { reportProgress } = require('../controllers/videoController');

// POST /api/videos/:id/progress
router.post('/:id/progress', reportProgress);

module.exports = router;
