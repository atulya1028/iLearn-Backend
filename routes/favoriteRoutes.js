const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Get all favorite books of a user
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate("bookId");
    res.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites", error });
  }
});

// ✅ Add a book to favorites
router.post("/add-to-favorites", authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.body;

    const existingFavorite = await Favorite.findOne({ userId: req.user.id, bookId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Book is already in favorites" });
    }

    const newFavorite = new Favorite({ userId: req.user.id, bookId });
    await newFavorite.save();
    res.status(201).json({ message: "Book added to favorites", favorite: newFavorite });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Error adding to favorites", error });
  }
});

// ✅ Remove a book from favorites
router.delete("/remove-from-favorites/:bookId", authMiddleware, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ userId: req.user.id, bookId: req.params.bookId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Book removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Error removing from favorites", error });
  }
});

// ✅ Get favorite books count for a user
router.get("/favorites/count", authMiddleware, async (req, res) => {
  try {
    const count = await Favorite.countDocuments({ userId: req.user.id });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching favorite count:", error);
    res.status(500).json({ message: "Error fetching favorite count", error });
  }
});


module.exports = router;
