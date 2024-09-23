const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
const mongoose = require('mongoose');


// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Products fetched:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(error);
  }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
  console.log("Fetching categories..."); // Log to verify this endpoint is hit
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send(error);
  }
});


router.get('/products', async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send(error);
  }
});

router.get('/products/:id', async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});

router.post('/products/:id/reviews', async (req, res) => {
  try {
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send({ message: 'Product not found' });

      const newReview = { rating, comment };
      product.reviews.push(newReview);
      
      // Calculate new average rating
      const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
      product.averageRating = averageRating;
      
      await product.save();
      res.json({ averageRating, reviews: product.reviews });
  } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});


module.exports = router;