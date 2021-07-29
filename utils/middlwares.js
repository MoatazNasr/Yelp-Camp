const Campground = require("../models/campground")
const Review = require('../models/review');
const {campgroundSchema , reviewSchema} = require('../joiSchemas');
const ExpressError = require('./ExpressError');

module.exports.isAuthorCampground = async (req, res, next) => {
// author = authorized
    const { id } = req.params;

    const campground = await Campground.findById(id);

    if (!campground.author._id.equals(req.user._id)) {

        req.flash('error', 'You do not have permission');

        return res.redirect(`/campground/${id}`);

    }

    next();

}

module.exports.isAuthorReview= async (req, res, next) => {

    const { id,reviewID } = req.params;

    const review = await Review.findById(reviewID);

    if (!review.author._id.equals(req.user._id)) {

        req.flash('error', 'You do not have permission');

        return res.redirect(`/campground/${id}`);

    }

    next();

}


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        // isAuthenticated method is auto addded to req obj by PASSPORT and checks if 
        // session exists contains user obj or the request made by an authen user or not 
        // isLoggedIn middleware for auth
        //console.log(req.path, req.originalUrl)
        // path and originalUrl are  fields stored in req objects where path stores what is written in http method
        // originalUrl stores what is written in http method and if merging params in app  

        req.session.returnTo = req.originalUrl;

        // field added to session object which stores originalUrl requsted 

        req.flash('error', ' you have to login')

        return res.redirect('/login');

    }

    next();

}



module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
