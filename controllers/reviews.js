const Product = require('../models/product.js');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params
    const car = await Product.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    car.reviews.push(review)
    await review.save()
    await car.save()
    req.flash('success', 'Review has been created!')
    res.redirect(`/cars/${car._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted.');
    res.redirect(`/cars/${id}`);
};
