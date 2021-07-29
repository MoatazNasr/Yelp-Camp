const mongoose = require('mongoose');
const passportLocalMong= require('passport-local-mongoose')
// we use it to provide us with some methods as register 

const userSchema = new mongoose.Schema({

    email: {
        type:String,
        required:true,
        unique : true 
    }


});


userSchema.plugin(passportLocalMong);

//is a Mongoose plugin that simplifies building username and password login with Passport.
//will hash and salt field to store the username, the hashed password and the salt value.
//adds some methods to your Schema as authenticate , register , serialize and deserialize


module.exports = mongoose.model('User', userSchema);
