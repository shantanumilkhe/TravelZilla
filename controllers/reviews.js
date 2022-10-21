const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReviews = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    const redirecturl = req.session.returnto || `/campgrounds/${id}`;
    res.redirect(redirecturl);

}

module.exports.deleteReviews = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Successfully Deleted review`)
    const redirecturl = req.session.returnto || `/campgrounds/${id}`;
    res.redirect(redirecturl)

}