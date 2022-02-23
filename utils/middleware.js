const ExpressError = require('./ExpressError');
const {campgroundSchema} = require('../schema');
const {reviewSchema} = require('../schema');
const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
   
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else
        next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);

    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You are not authorised to update this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else
        next();
}

module.exports.isReviewAuthor = async function(req, res, next) {
    const {reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("You are not authorized to delete this Review");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();

}