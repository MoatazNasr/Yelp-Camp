const mongoose = require('mongoose');
const Campground = require('../models/campground')
// .. dots as wanna access a file in a folder from a file in folder

const cities = require('./cities')

const { descriptors, places } = require('./seedHelper');

// descriptors and places are arrays equal to exported file
// we put them inside braces as module.export
// return an object , 

mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('mongo is connected'))
    .catch((err) => console.log(err));



const seedDB = async () => {

    await Campground.deleteMany({});


    for (let i = 0; i < 200; i++) {

        const randomCity = Math.floor(Math.random() * 1000);
        const randomDescription = Math.floor(Math.random() * descriptors.length);
        const randomPlace = Math.floor(Math.random() * places.length);
        const randomPrice = (Math.floor(Math.random() * 50)) + 10;
        //  make 5 objects (records , documents ) of campground model
        // random gets a number range from 0 to 1000 as num 
        // of objects inside cities array
        // const sample = array => array[math.floor...etc * array.length]
        // title equals ` ${sample[descriptors]}`
        // this equals to the two lines of random desc and place

        const newCampground = new Campground({

            author: '60f2041e89c8da6ccc2be28b'
            ,

            title: `${descriptors[randomDescription]} ${places[randomPlace]} `
            ,
            location: `${cities[randomCity].city} ${cities[randomCity].state}`
            // makes the location of an record equals to 
            // a city and state in a random object inside array
            ,

            geometry: {
            
                type : "Point",

                coordinates: [cities[randomCity].longitude ,cities[randomCity].latitude ]
            },

            images:  [
                {
                
                  url: 'https://res.cloudinary.com/dqm9av6vd/image/upload/v1627173548/YelpCamp/i2neeiv30hx5d0oe475t.jpg',
                  filename: 'YelpCamp/i2neeiv30hx5d0oe475t'
                },
                {
           
                  url: 'https://res.cloudinary.com/dqm9av6vd/image/upload/v1627173548/YelpCamp/gtptjmtpkr8sillcxeib.jpg',
                  filename: 'YelpCamp/gtptjmtpkr8sillcxeib'
                }
              ]
              ,
            
            
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt officia provident earum harum temporibus nobis, molestias in iste tempore quia itaque hic dolores nam corporis beatae omnis laborum nisi neque"
            ,
            price: randomPrice 
        })

    await newCampground.save();

}

}
seedDB()
    .then(() => {

        mongoose.connection.close();
    })

// close the connection of seed file to DB after success of function
