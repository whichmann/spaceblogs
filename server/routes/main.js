const express = require('express');

const router = express.Router()

// Routes
router.get('', (req, res) => {
    const locals = { title: "Spaceblogs", description: "Your blog. Constellation-driven."}
    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;