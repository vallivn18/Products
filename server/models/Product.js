const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: [String],
  variants: [
    {
      color: String,
      price: Number,
      images: [String],
    },
  ],
  category: String,
  tags: [String],
  reviews: [reviewSchema], // New field for reviews
  averageRating: { type: Number, default: 0 }, // New field for average rating
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
