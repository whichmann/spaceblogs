require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const LOCALS = { title: "Spaceblogs", body: "Admin Page" };

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * Auth Middleware
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

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

/**
 * POST /
 * Admin - edit post
 */
router.get('/edit-post/:id', authMiddleware, async ({ params }, res) => {
    try {
        let slug = params.id;
        const data = await Post.findById({ _id: slug });
        res.render('admin/edit-post', { data, locals: { ...LOCALS, layout: adminLayout, title: `Spaceblogs | ${data.title}` } });
    } catch (error) {
        console.log({ error })
    }
})

/**
 * PUT /
 * Admin - edit post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now(),
        })

        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log({ error });
    }
})

/**
 * DELETE /
 * Admin - delete post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)

        res.redirect("/dashboard");
    } catch (error) {
        console.log({ error });
    }
})

/**
 * POST /
 * Admin - add post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const { title, body } = req.body;

        try {
            const post = await Post.create({ title, body });
            res.redirect('dashboard')
        } catch (error) {
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

/**
 * GET /
 * Admin - add post page
 */
router.get('/add-post', async (req, res) => {
    try {
        res.render('admin/add-post', { locals: { ...LOCALS, title: 'Add new page' }, layout: adminLayout })
    } catch (error) {
        console.log({ error })
    }
})

/**
 * GET /
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals: LOCALS,
            data,
            layout: adminLayout
        });

    }
    catch (error) {
        console.log({ error });
    }
})

module.exports = router; 