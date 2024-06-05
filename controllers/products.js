
const Product = require('../models/product');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const { sort, make } = req.query;
    let filter = {};
    let sortOption = {};

    if (make) {
        filter.make = make;
    }

    switch (sort) {
        case 'price-asc':
            sortOption.price = 1;
            break;
        case 'price-desc':
            sortOption.price = -1;
            break;
        case 'mileage-asc':
            sortOption.driven = 1;
            break;
        case 'mileage-desc':
            sortOption.driven = -1;
            break;
        default:
            sortOption = {};
    }

    const cars = await Product.find(filter).sort(sortOption);
    const days = Math.floor(Math.random() * 31);

    for (let i = cars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cars[i], cars[j]] = [cars[j], cars[i]];
    }

    res.render('cars/index', { cars, days });
};

module.exports.renderNewForm = (req, res) => {
    res.render('cars/new');
};

module.exports.createListing = async (req, res) => {
    const car = new Product(req.body.car);
    car.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.author = req.user._id;
    await car.save();
    console.log(car)
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/cars/${car._id}`);
};

module.exports.deleteImage = async (req, res) => {
    const { id, imageId } = req.params;
    console.log(`Attempting to delete image with ID: ${imageId} from product ID: ${id}`);

    try {
        const product = await Product.findById(id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the image within the product's images array
        const image = product.images.find(img => img._id.toString() === imageId);
        if (!image) {
            req.flash('error', 'Image not found');
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(image.filename);
        console.log(`Image deleted from Cloudinary: ${image.filename}`);

        // Remove the image from the database
        await Product.findByIdAndUpdate(id, { $pull: { images: { _id: imageId } } });
        console.log(`Image removed from database for product ID: ${id}`);

        req.flash('success', 'Image deleted successfully');
        return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error during image deletion:', error);
        req.flash('error', 'Failed to delete image');
        return res.status(500).json({ message: 'Failed to delete image' });
    }
};

module.exports.myListing = async (req, res) => {
    const userId = req.user._id;
    const cars = await Product.find({ author: userId }).populate('author');
    if (!cars.length) {
        req.flash('error', 'Cannot find any listings!');
        return res.redirect('/cars');
    }
    res.render('cars/mylisting', { cars });
};

module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const car = await Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!car) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/cars');
    }
    res.render('cars/show', { car });
};

module.exports.renderUpdateListing = async (req, res) => {
    const { id } = req.params;
    const car = await Product.findById(id);
    if (!car) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/cars');
    }
    res.render('cars/edit', { car });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const car = await Product.findById(id);

    if (!car) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/cars');
    }

    Object.assign(car, req.body.car);

    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
        const uploadResults = await Promise.all(uploadPromises);
        car.images.push(...uploadResults.map(result => ({ url: result.secure_url, filename: result.public_id })));
    }

    await car.save();
    console.log(car.images); // Log the images to verify they are saved
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/cars/${car._id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing');
    res.redirect('/cars');
};
