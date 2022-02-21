const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch(e => console.log("Could not connect to Mongo", e));

const sample = arr => arr[Math.floor(Math.random() * arr.length)]; 

const seedDB = async () => {
    await Campground.deleteMany({});
    
    for(let i = 0; i < 50; i++){
        const random = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const cg = new Campground({
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random].city}, ${cities[random].state}`,
            image : 'https://source.unsplash.com/collection/484351',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt sit cumque id enim modi, vero harum nihil cum obcaecati ut nesciunt aut unde natus dolore placeat aspernatur voluptatem! Est, eos!',
            price : price
        })
        await cg.save();
    }
}

seedDB().then(() => {mongoose.connection.close();});