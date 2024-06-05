const express = require('express');
const router = express.Router({ mergeParams: true });
// const { reviewSchema } = require('../schema.js')
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
// const Product = require('../models/product');
// const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')

const reviews = require('../controllers/reviews.js')

// REVIEWS
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router
