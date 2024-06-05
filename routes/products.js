const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCar } = require('../middleware.js');
const catchAsync = require('../utils/catchAsync.js');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const cars = require('../controllers/products.js');

router.route('/')
    .get(catchAsync(cars.index)) // ALL CARS
    .post(isLoggedIn, upload.array('image'), validateCar, catchAsync(cars.createListing)); // CREATE NEW LISTING

router.get('/new', isLoggedIn, cars.renderNewForm); // CREATE NEW LISTING

router.get('/mylisting', isLoggedIn, catchAsync(cars.myListing)); // SHOW USER LISTING

router.route('/:id')
    .get(catchAsync(cars.showProduct)) // SHOW PRODUCT DETAILS
    .put(isLoggedIn, upload.array('images'), isAuthor, validateCar, catchAsync(cars.updateListing)) // UPDATE LISTING DETAILS
    .delete(isLoggedIn, isAuthor, catchAsync(cars.deleteListing)); // DELETE LISTING

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(cars.renderUpdateListing)); // UPDATE LISTING DETAILS
router.delete('/:id/images/:imageId', isLoggedIn, isAuthor, catchAsync(cars.deleteImage)); // DELETE IMAGE


module.exports = router;
