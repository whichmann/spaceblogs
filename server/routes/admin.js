require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LOCALS = { title: "Spaceblogs", body: "Admin Page" };

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * POST /
 * Admin - check logic
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard')
    } catch (error) {
        console.log({ error });
    }
})

/**
 * POST /
 * Admin - register account
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashPassword });
            res.status(201).json({ message: 'User Created', user })
        } catch (error) {
            if (error?.code === 11000) {
                res.status(409).json({ message: "User already in use" })
            }
            res.status(500).json({ message: "Internal error" })
        }
    } catch (error) {
        console.log({ error });
    }
})

router.get('/admin', async (req, res) => {
    try {
        res.render('admin/index', { locals: LOCALS, layout: adminLayout })
    } catch (error) {
        console.log({ error })
    }
})

router.get('/dashboard', async (req, res) => {
    res.render('admin/dashboard');
})

module.exports = router; 