const mongoose = require('mongoose')
const Review = require('./review');
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    VIN: {
        type: String,
        required: true
    },
    year_model: {
        type: Number,
        enum: [
            2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
            2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
            1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987,
            1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977
        ]
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Manual', 'Automatic']
    },
    driven: {
        type: Number,
        required: true
    },
    fuel_type: {
        type: String,
        required: true,
        enum: ['Gasoline', 'Diesel']
    },
    owner: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },
    images: [
        {
            url: String,
            filename: String
        }
        
      ],
    // pictureInside: {
    //     type: String,
    //     required: true
    // },
    // pictureOutside: {
    //     type: String,
    //     required: true
    // },
    // price: Number,
    // email: String,
    // phone_number: String,
    // VIN: String,
    // year_model: {
    //     type: Number,
    //     enum: [
    //         2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
    //         2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
    //         1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987,
    //         1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977
    //     ]
    // },
    // make: String,
    // model: String,
    // transmission: {
    //     type: String,
    //     enum: ['Manual', 'Automatic']
    // },
    // driven: Number,
    // fuel_type: {
    //     type: String,
    //     enum: ['Gasoline', 'Diesel']
    // },
    // owner: {
    //     type: Number,
    //     enum: [1, 2, 3, 4, 5]
    // },
    // pictureInside: String,
    // pictureOutside: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

ProductSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Product', ProductSchema)
