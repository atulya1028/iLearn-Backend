// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  cart: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }, // Added missing comma here
    }
  ],
  totalPrice: { type: Number, default: 0 }, 
  deliveryInstructions: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  orders: [
    {
      items: [
        {
          book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
          quantity: { type: Number, default: 1 },
          price: { type: Number, required: true },
        }
      ],
      totalPrice: { type: Number, required: true },
      deliveryAddress: {
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        apartment: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        phone: { type: String },
      },
      saveInfo: { type: Boolean },
    }
  ],
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
