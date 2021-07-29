const express = require('express');
const catchAsync = require('../utils/catchAsync')
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthorCampground, validateCampground } = require('../utils/middlwares')
const campgrounds = require('../controllers/campgrounds');
const {storage} = require('../cloudinary');
// change multer dest: to storage as to store it in cloudinary instead of local file
const multer = require('multer');
const upload = multer({storage})
// multer is an middleware used to parse files ,it adds to request obj body obj & file(s) obj
// body object which contains form texts URL encoded
// and file(s) object contains file(s) which get uploaded

// we use merge params as if we use prefix /:id the params shared between two files not diff params

router.route('/')

    
    .get(catchAsync(campgrounds.index))

     .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'),(req,res)=>{
    //     // console.log(req.body,req.file) // for single
    //     console.log(req.body,req.files) // for array and change the new template to multiple
    //     res.send('it worked')
    // });
    // single method looks for input name to parse the file
    // array method looks for input name to parse the file

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')

    .get(catchAsync(campgrounds.showCampground))

    .put(isLoggedIn, isAuthorCampground,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))

    .delete( isAuthorCampground, campgrounds.deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthorCampground, catchAsync(campgrounds.renderEditForm))

module.exports = router;