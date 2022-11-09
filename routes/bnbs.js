const express = require('express');
const router = express.Router();
const catchAsync = require("../Utility/catchAsync");  
const { isLoggedIN, validatebnb, isAuthor } = require('../middleware')
const bnbs = require('../controllers/bnbs')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(  catchAsync(bnbs.index))
    .post( isLoggedIN,upload.array('image'), validatebnb, catchAsync(bnbs.createForm))
    

router.get('/new', isLoggedIN, bnbs.newForm )

    router.route('/:id')
    .get( catchAsync(bnbs.showbnb))
    .put( isLoggedIN, isAuthor, upload.array('image'), validatebnb, catchAsync(bnbs.posteditbnb))
    .delete( isLoggedIN, isAuthor, catchAsync(bnbs.deletebnb))



router.get('/:id/edit', isLoggedIN, isAuthor, catchAsync(bnbs.editbnb))



module.exports = router;