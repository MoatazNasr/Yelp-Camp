if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
// process.env.NODE_ENV , environment variable where if we are in development state
// take the vars in .env file and put them in the proccess..... variable 
//if not we do not take the file data 
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const usersRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL||'mongodb://localhost/yelp-camp';
// cloud DB

// ejs-mate makes things more simpler to modify , update
// style ejs files as make all of them relate 
// to a base page which we style it and the style goes to all
// we specify the contents of templates in a section 
// in boilerplate and everything in boilerplate 
// is repeated in each template 


// catchAsync instead of using try & catch


// joi is a javascript validator tool which validate data in server before saving it in DB
// local DB'mongodb://localhost/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('mongo is connected'))
    .catch((err) => console.log(err));


app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))
// remove any characters/symbols as ($ , @ , # )used for quering DB 
// or accessing an unauthorized thing from req.body&query  

app.use(helmet({
    contentSecurityPolicy: false 
}));
// use all 12 middlewares , also protects our websites from many infections
const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
];
const styleSrcUrls = [
    "https://api.mapbox.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqm9av6vd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// we are restricting our scripts / images / files / apis etc places to take them from
// prevent our website from taking anything except from things specified above

const secret = process.env.SECRET ||"thisisaserioussecret";
const store = MongoStore.create ({

    mongoUrl : dbUrl,
    secret : secret,
    touchAfter:  24 * 60 * 60 , 
    // saving the session data after 24 hours not saving many times even not get updated ,  60 seconds

});
// storing session in Mongo DB instead of storing it temporarily in memory 

store.on('error' , (e)=> {

    console.log('Session store error',e)

})

const sessionConfig = {
    store : store ,
    // store: store ,,, it in store object  
    secret: secret,
    name: 'howahowa', 
    // change the name of session 
    httpOnly: true,
    // means it will be accessed only from HTTP protected from javascript
    // secure:true, means cookies will be accessed only by https not only http
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // 7 days , a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

// httponly means that the client can not access the cookie and even did it disappear
// expires and maxage of a cookie ,we calculate them by miliseconds 

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
// intialize passport object 
app.use(passport.session());
// must be after app.use (session) , use this if our app uses persistant login sessions
//acts as a middleware to alter the req object and change the 'user' value that is currently 
//the session id (from the client cookie) into the true deserialized user object.
// there is really only one session, which is managed by Express
//Passport merely piggy backs off the ExpressJS session to store data for authenticated users

passport.use(new localStrategy(User.authenticate()));

// strategies are used by passport for authentication  (diff strategies due to diff ALGOS)
// we also used User.authenticate as passport-local-mongoose added this method to user Model
// instead of using passport.authenticate 

passport.serializeUser(User.serializeUser());
// how we store user object data in session
passport.deserializeUser(User.deserializeUser());
// how we retrieve user object data in session

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    // which this user object is added by passport in session to store data
    // we stores the username of a user in session as it is unique one and session ID is same as user ID 

    res.locals.error = req.flash('error');

    res.locals.success = req.flash('success');

    next();

})

// An object that contains response local variables scoped to the request,and available 
// to all templates , we use res.locals if we want to propgate some data  



app.use('/campground', campgroundsRoutes);
app.use('/campground/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.get('/home',(req,res)=>{
    res.render('home')
})
app.all('*', (req, res, next) => {

    next(new ExpressError( "Page Not Found"), 404);
});

// this is executed when there is not matched route

app.use((err, req, res, next) => {

    const { statusCode = 400, message = "Something went wrong" } = err;

    res.status(statusCode).render('error', { err })
})



app.listen(3020, () => {

    console.log('Server is on Port 3020')

})



