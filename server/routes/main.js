const express = require('express');

const router = express.Router()

const Post = require('../models/Post');

const LOCALS = { title: "Spaceblogs", body: "Your blog. Constellation-driven." };

// Routes
router.get('', async (req, res) => {
    const PAGINATION_SIZE = 10;

    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(PAGINATION_SIZE * page).limit(PAGINATION_SIZE).exec();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage * PAGINATION_SIZE < count;
    try {
        res.render('index', { locals: LOCALS, data, count, nextPage: hasNextPage ? nextPage : null });
    } catch (error) {
        console.log({ error })
    }
});

/**
 * GET /
 * POST :id
 */

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        res.render('post', { data, locals: LOCALS });
    } catch (error) {
        console.log({ error })
    }
})

module.exports = router;

// Old code to inject some dummy data. Left for learning purposes:

// router.get('', async (req, res) => {
//     const locals = { title: "Spaceblogs", body: "Your blog. Constellation-driven." }

//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch (error) {
//         console.log({error})
//     }
// });

// function insertPostData() {
//     Post.insertMany([{
//         title: "Building a blog",
//         body: "Body text"
//     }, { "title": "Persevering web-enabled paradigm", "body": "Storage organizer for art supplies and tools." },
//     { "title": "Networked 24 hour budgetary management", "body": "Classic marinara sauce for all pasta dishes." },
//     { "title": "Ameliorated systematic groupware", "body": "Fragrant fried rice with authentic Thai basil and veggies." },
//     { "title": "Cloned coherent challenge", "body": "Healthy salad made with chickpeas, vegetables, and a lemon dressing." },
//     { "title": "Innovative disintermediate toolset", "body": "Luxurious satin slip dress for an elegant evening look." },
//     { "title": "Extended composite methodology", "body": "Shower head designed for a strong spray and complete coverage." },
//     { "title": "Cross-platform modular groupware", "body": "Ergonomic desk that adjusts height for standing or sitting." },
//     { "title": "Intuitive stable collaboration", "body": "Affordable fitness tracker with heart rate monitor." },
//     { "title": "Assimilated transitional forecast", "body": "Comfortable gaming headset with surround sound." },
//     { "title": "Managed transitional core", "body": "Rapid boil electric kettle with temperature control." },
//     { "title": "Multi-lateral responsive local area network", "body": "Savory wraps with buffalo chicken and fresh vegetables." },
//     { "title": "Synergized 6th generation hub", "body": "Lightweight cover-up perfect for the beach, with a breezy design." },
//     { "title": "Focused heuristic website", "body": "Instant oatmeal cups with blueberries for an easy breakfast." },
//     { "title": "Realigned zero defect budgetary management", "body": "Spacious 2-person camping tent with waterproof cover." },
//     { "title": "Upgradable even-keeled firmware", "body": "Refreshing apple juice, 100% juice with no added sugar." },
//     { "title": "Front-line context-sensitive middleware", "body": "Wi-Fi-enabled digital frame for displaying photos." },
//     { "title": "Reduced user-facing ability", "body": "Flexible tray for easy-release ice cubes." },
//     { "title": "Triple-buffered zero defect hardware", "body": "A mix to create a delicious onion dip for parties or snacking." },
//     { "title": "Open-source optimizing encryption", "body": "Everything you need to make your own scented candles at home." },
//     { "title": "Profound empowering algorithm", "body": "Durable ceramic bakeware for casseroles and desserts." },
//     { "title": "Programmable value-added definition", "body": "Connect your phone to the car's audio system via Bluetooth." },
//     { "title": "Face to face attitude-oriented matrices", "body": "Comfortable slide sandals for lounging by the pool." },
//     { "title": "Universal uniform firmware", "body": "Sweet and salty popcorn with sea salt and caramel, a tasty treat." },
//     { "title": "Ergonomic zero tolerance encoding", "body": "A zero-calorie coconut oil spray for cooking and baking." },
//     { "title": "Virtual regional neural-net", "body": "Pancake mix infused with seasonal pumpkin spice flavor." }])
// }

// insertPostData()