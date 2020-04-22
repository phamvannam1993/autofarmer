const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');

// @route   GET api/startups
// @desc    Get all startups
// @access  Private
router.get('/', async (req, res) => {
    try {
        console.log('api/startups/')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;