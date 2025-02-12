//models/Book.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  type: { type: String },
  price: { type: Number },
  image: { type: String },
  description: { type: String },
  sku: { type: String },
  ean: { type: String },
  language: { type: String },
  binding: { type: String },
  isFavorite: { type: Boolean, default: false } // Added missing comma here
  // Will store the path to the uploaded image
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
