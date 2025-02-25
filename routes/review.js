const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Create new review
router.post("/", async (req, res) => {
  try {
    const { book_id, user_id, rating, comment } = req.body;
    const reviewId = await Review.addReview({ book_id, user_id, rating, comment });
    res.status(201).json({ message: "Review added successfully", reviewId });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

// Update review by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { book_id, user_id, rating, comment } = req.body;
    const success = await Review.updateReview(id, { book_id, user_id, rating, comment });
    if (success) {
      res.json({ message: "Review updated successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
});

// Delete review by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Review.deleteReview(id);
    if (success) {
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
});

module.exports = router;
