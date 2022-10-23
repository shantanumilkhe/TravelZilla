// import fetch from "node-fetch";
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')

router.route('/')
    .get(catchAsync(hotel.index))


module.exports = router;