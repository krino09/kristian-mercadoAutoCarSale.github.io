const Product = require('../models/product');
const cars = require('./cars');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

mongoose.connect('mongodb://127.0.0.1:27017/autoCarSale')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!");
        console.log(err);
    });

const seedDB = async () => {
    await Product.deleteMany({});
    for (const carData of cars) {
        const car = new Product({
            author: '6656a4e0c584e89053823318',
            images: [
                {
                    url: 'https://res.cloudinary.com/dk0dr0gtw/image/upload/v1717415114/car_images/ag5enguhsfebdvoaejuq.jpg',
                    filename: 'car_images/ag5enguhsfebdvoaejuq',
                    _id: new ObjectId('665daccb14c05fb8129128aa')
                }
            ],
            ...carData
        });

        await car.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
