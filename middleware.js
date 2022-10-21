const { campgroundSchema, reviewSchema } = require('./Schema.js')
const ExpressError = require("./Utility/ExpressError");
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIN = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnto = req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatecampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perform this operation');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perform this operation');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}