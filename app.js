const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Model/user')
const userRouter = require('./router/User')
const cors = require("cors");
const path = require("path");

const app = express();

const MONGO_URI = "mongodb://localhost:27017/mad";
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/image', express.static('image'));

// Session setup
const store = MongoStore.create({
    mongoUrl: MONGO_URI,
    crypto: { secret: "yourSessionSecret" },
    touchAfter: 24 * 60 * 60,
});
app.use(
    session({
        store,
        secret: "yourSessionSecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set `curUser` in `res.locals` for templates
app.use((req, res, next) => {
    res.locals.curUser = req.user || null;
    console.log(req.body)
    next();
});


// Routes
app.use('/user', userRouter);

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});