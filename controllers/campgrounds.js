const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN ; 
const geocoder = mbxGeocoding({accessToken : mapBoxToken});
// which contains forward and reverse methods of geocoding 
module.exports.index = async (req, res) => {

    const campgrounds = await Campground.find({});

    // by default return every record and put them in array

    res.render('campground/index', { campgrounds });

}


module.exports.renderNewForm = (req, res, next) => {

    res.render('campground/new');

}

module.exports.createCampground = async (req, res) => {

    const geoData =  await geocoder.forwardGeocode({

        query :req.body.campground.location,
        limit: 1
        // limiting num of features
    }).send()
   

    const campground = new Campground(req.body.campground);

    campground.geometry= geoData.body.features[0].geometry;
    console.log(geoData.body.features[0].geometry);
    console.log(campground.geometry);
    campground.images = req.files.map( x => ({ url : x.path , filename : x.filename }) )
    // destructure fields from x objects but use ({}) for each array element contains 
    campground.author = req.user._id;

    // as we used in new.ejs file that the inputs
    // (location & title) will be in campground object
    // so the reqbody is an object contains an object(campground)
    //and we need to access values inside campground
    // also req.body work on name = location & title 
    await campground.save();

    req.flash('success', 'hey new campground has been made');

    res.redirect('/campground');

}


module.exports.showCampground = async (req, res) => {

    const foundObj = await Campground.findById(req.params.id)
        .populate({

            path: 'reviews',

            populate: { path: 'author' }
        }
        ).populate('author');
        // find campground then populate a field which it's path is 'reviews'
        // then go to this field and populate a field nested in it which it's path 'author'
        // then populate author field for each campground 


    // if (!foundObj) {

    // return next(new AppError('Product not found', 404));
    //in async function we handle errors not by throwing it but we put errors in next method then next goes middleware
    //this is a pattern for handling errors in async function ,as the promise is not solved so (catched) , code err
    // throw new Error('Product not found', 404);

    res.render('campground/show', { foundObj })

    // catch (err) {

    //     next(err)
    //     // we have to throw the new error instead of return as using try and catch

}

module.exports.renderEditForm =async (req, res) => {

    const campgroundEdit = await Campground.findById(req.params.id);

    res.render('campground/edit', { campgroundEdit });

}

module.exports.updateCampground =async (req, res) => {

    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });

    campground.images = req.files.map( x => ({ url : x.path , filename : x.filename }) )

    await campground.save();

    req.flash('success', 'updated a campground');

    res.redirect(`/campground/${campground.id}`);

} 

module.exports.deleteCampground = async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);

    req.flash('success', 'deleted a campground');

    res.redirect('/campground');

}