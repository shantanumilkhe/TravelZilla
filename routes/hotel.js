// // import fetch from "node-fetch";
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router({mergeParams: true});
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')

router.route('/')
    .get(catchAsync(hotel.index));

router.route('/v2')
    .get(catchAsync(hotel.indexv2));


module.exports = router;