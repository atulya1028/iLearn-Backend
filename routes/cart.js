//routes/cart.js
const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Add item to cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingItem = user.cart.find(item => item.book.toString() === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ book: bookId, quantity, price: book.price });
    }

    user.totalPrice = user.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    await user.save();

    res.status(200).json({ message: "Book added to cart", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/remove/:bookId", authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(item => item.book.toString() !== bookId);
    user.totalPrice = user.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    await user.save();

    res.status(200).json({ message: "Book removed from cart", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.book");
    res.status(200).json({ cart: user.cart, totalPrice: user.totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Cart Count API
router.get("/cart-count", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartCount = user.cart.reduce((total, item) => total + item.quantity, 0); // Total quantity of items in the cart
    res.status(200).json({ cartCount });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ message: "Error fetching cart count", error });
  }
});

// Update item quantity in cart
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find(item => item.book.toString() === bookId);

    if (!cartItem) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    cartItem.quantity = quantity;
    user.totalPrice = user.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await user.save();

    res.status(200).json({ message: "Quantity updated", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/proceed-to-checkout", authMiddleware, async (req, res) => {
  try {
    const { deliveryInstructions } = req.body;
    const user = await User.findById(req.user._id).populate("cart.book");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const totalAmount = user.cart.reduce((total, item) => total + item.quantity * item.price, 0);

    // Simulating order processing (without clearing the cart)
    const order = {
      user: user._id,
      items: user.cart,
      totalAmount,
      deliveryInstructions,
      status: "Pending",
      createdAt: new Date(),
    };

    res.status(200).json({
      message: "Checkout successful! Proceeding to order creation...",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Error during checkout", error });
  }
});


// ✅ Get Checkout Details API
router.get("/get-checkout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.book");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const cartItems = user.cart.map((item) => ({
      _id: item.book._id,
      book: item.book,
      price: item.price,
      quantity: item.quantity,
    }));

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    res.status(500).json({ message: "Error fetching checkout details", error });
  }
});

router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.book");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { deliveryAddress, saveInfo, deliveryInstructions } = req.body;

    // Calculate total price
    const totalPrice = user.cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Save the order inside the user's orders array
    user.orders.push({
      items: user.cart, // Save cart items
      totalPrice,
      deliveryAddress,
      deliveryInstructions,
      saveInfo,
    });

    await user.save(); // Save user with updated order history

    res.status(201).json({ message: "Order placed successfully", orders: user.orders });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});





module.exports = router;
