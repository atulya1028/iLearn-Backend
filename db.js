//db.js
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

module.exports = mongoose;
