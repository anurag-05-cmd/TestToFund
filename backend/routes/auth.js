const express = require('express');
const router = express.Router();
const { connect } = require('../controllers/authController');

// POST /api/auth/connect
router.post('/connect', connect);

module.exports = router;
