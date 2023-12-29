const User = require('../models/user');


module.exports.renderRegisterForm = (req, res) => {
    

    res.render('user/register');
}

module.exports.register = async (req, res,next) => {

    try {
        const { email, username, password } = req.body;

        const tempUser = new User({ email, username });

        const registerdUser = await User.register(tempUser, password);
        // register method , pass the user object , check the username is unique 
        // then hash the password (chicken) and store it in user object and store the new obj in DB

       

        req.login(registerdUser,err => {

            if (err) return next(err);

            req.flash('success', 'welcome');
        });
        // login method added by passport and used to login immediately after registeration
        
        res.redirect('/campground');
    }

    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = async (req, res) => {

    res.render('user/login');

}

module.exports.login=(req, res) => {

    // if we just enterd the callback function this means passport middleware indicates authen user

    const redirectURL= req.session.returnTo;

    req.flash('success', 'hey welcome back');
    
    if (redirectURL){

    return res.redirect(redirectURL);

    }
    delete req.session.returnTo;
    // to empty this field as to not always return to it 
    res.redirect('/campground');
}

module.exports.logout=(req,res)=>{

    req.logout();
    // added by passport 
    req.flash('success','bye!');
    res.redirect('/campground')
}
