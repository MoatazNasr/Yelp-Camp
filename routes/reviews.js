const express = require('express');
const catchAsync = require('../utils/catchAsync')
const router = express.Router({ mergeParams: true });
const { isLoggedIn,isAuthorReview ,validateReviews } = require('../utils/middlwares');
const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview))

router.delete('/:reviewID', isLoggedIn ,isAuthorReview,reviews.deleteReview)


module.exports = router;