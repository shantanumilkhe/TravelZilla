const express = require('express');
const router = express.Router();
const catchAsync = require("../Utility/catchAsync");  
const { isLoggedIN, validatecampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(  catchAsync(campgrounds.index))
    .post( isLoggedIN,upload.array('image'), validatecampground, catchAsync(campgrounds.createForm))
    

router.get('/new', isLoggedIN, campgrounds.newForm )

    router.route('/:id')
    .get( catchAsync(campgrounds.showCampground))
    .put( isLoggedIN, isAuthor, upload.array('image'), validatecampground, catchAsync(campgrounds.posteditCampground))
    .delete( isLoggedIN, isAuthor, catchAsync(campgrounds.deleteCampground))



router.get('/:id/edit', isLoggedIN, isAuthor, catchAsync(campgrounds.editCampground))



module.exports = router;