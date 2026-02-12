const express = require('express');
const router = express.Router();
const User = require('../models/User');

const LOCALS = { title: "Spaceblogs", body: "Admin Page" };

const adminLayout = '../views/layouts/admin';

/**
 * GET /
 * Admin
 */

router.get('/admin', async (req, res) => {
    try {
        res.render('admin/index', { locals: LOCALS, layout: adminLayout })
    } catch (error) {
        console.log({ error })
    }
})

module.exports = router; 