// import fetch from "node-fetch";
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')

router.route('/')
    .get(catchAsync(hotel.index))

router.get('/booking/:id', catchAsync( async (req, res, next) =>{
    res.render('campgrounds/booking');
}))



router.post('/postBooking', catchAsync( async (req, res, next) =>{
console.log(req.body.book);
const redirecturl = "/hotel/booking"
res.redirect(redirecturl);
}))

module.exports = router;