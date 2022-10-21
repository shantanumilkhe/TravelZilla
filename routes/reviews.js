const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../Utility/catchAsync");
const {isLoggedIN, validatereview, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIN, validatereview, catchAsync(reviews.createReviews))

router.delete('/:reviewId',isLoggedIN, isReviewAuthor, catchAsync(reviews.deleteReviews))

module.exports = router;