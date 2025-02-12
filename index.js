//index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("./db.js");
const path = require("path");
const fs = require("fs");
const Book = require("./models/Book.js");
const authRoutes = require("./routes/auth.js");
const cartRoutes = require('./routes/cart.js');
const bookRoutes = require('./routes/book.js');
const favoritesRoutes = require('./routes/favoriteRoutes.js');
const helmet = require('helmet');

const app = express();

// Helmet security settings
app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // or use a hash or nonce
  },
}));

app.use(express.json());

// CORS configuration
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}
app.options("*", cors(corsConfig)); // Fixed CORS preflight request
app.use(cors(corsConfig));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/book', bookRoutes);
app.use('/favorite', favoritesRoutes);

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/",(req,res) => {
  res.send('Welcome to Book API');
})

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create a new book
app.post("/api/books", upload.single("image"), async (req, res) => {
  try {
    const { title, author, type, price, description, sku, ean, language, binding } = req.body;
    if (!title || !author || !price || !description) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const newBook = new Book({
      title,
      author,
      type,
      price,
      description,
      image: req.file.path,
      sku,
      ean,
      language,
      binding,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get a book by title
app.get("/api/books/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const book = await Book.findOne({ title });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Ensure uploads directory exists
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
