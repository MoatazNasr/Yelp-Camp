const Campground=require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {

    const review = new Review(req.body.review);

    review.author = req.user._id;

    const campground = await Campground.findById(req.params.id);

    campground.reviews.push(review);

    await campground.save();

    await review.save();

    req.flash('success', 'created new review');

    res.redirect(`/campground/${req.params.id}`);

}


module.exports.deleteReview = async (req, res) => {

    const { id, reviewID } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })

    // find the campgrond of id , remove from reviews array the reviewID one 
    //$pull operator removes a value from a field in document by matching a specfied condition

    await Review.findByIdAndDelete(reviewID);

    req.flash('success', 'deleted a review');


    res.redirect(`/campground/${id}`);

}
