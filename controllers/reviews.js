const bnb = require('../models/bnb');
const Review = require('../models/review')

module.exports.createReviews = async (req, res) => {
    const { id } = req.params;
    const bnb = await bnb.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bnb.reviews.push(review);
    await review.save();
    await bnb.save();
    const redirecturl = req.session.returnto || `/bnbs/${id}`;
    res.redirect(redirecturl);

}

module.exports.deleteReviews = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await bnb.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Successfully Deleted review`)
    const redirecturl = req.session.returnto || `/bnbs/${id}`;
    res.redirect(redirecturl)

}