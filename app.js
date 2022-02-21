const express = require ('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require("connect-flash");
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
    })
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch(e => console.log("Could not connect to Mongo", e));

const sessionConfig = {
    secret : 'thisIsASecret',
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge : (1000 * 60 * 60 * 24 * 7),
        httpOnly: true
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ('views')));
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')));



app.get('/req', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('Error',{err});
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})