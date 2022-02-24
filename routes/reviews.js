const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../utils/middleware');

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview))

module.exports = router;