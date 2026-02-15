require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db')
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo').default;
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'))

// Connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard dog',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: new Date(some date) },
}))

// Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})