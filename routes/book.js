//routes/book.js
const express = require("express");
const Book = require("../models/Book");
const multer = require("multer");
const path = require("path");

const router = express.Router();

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

// Create a new book
router.post("/", upload.single("image"), async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const books = await Book.find({
      $or: [
        { title: { $regex: new RegExp(q, "i") } },
        { author: { $regex: new RegExp(q, "i") } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Error searching books", error });
  }
});


// Get a book by title
router.get("/:title", async (req, res) => {
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

module.exports = router;
