const express = require("express");
const router = express.Router();
const Loans = require("../models/Loans");

// CREATE: Tambah peminjaman baru
router.post("/", async (req, res) => {
  try {
    const { book_id, user_id, loan_date, return_date, status } = req.body;

    // Validasi status
    const validStatuses = ["dipinjam", "dikembalikan"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const loanId = await Loans.addLoan({ book_id, user_id, loan_date, return_date, status });
    res.status(201).json({ message: "Loan added successfully", loanId });
  } catch (error) {
    res.status(500).json({ error: "Failed to add loan", details: error.message });
  }
});

// READ: Ambil semua peminjaman
router.get("/", async (req, res) => {
  try {
    const loans = await Loans.getAllLoans();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loans", details: error.message });
  }
});

// READ: Ambil peminjaman berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loans.getLoanById(Number(id)); // Konversi id ke Number

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loan", details: error.message });
  }
});

// UPDATE: Perbarui peminjaman berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { book_id, user_id, loan_date, return_date, status } = req.body;

    // Validasi status
    const validStatuses = ["dipinjam", "dikembalikan"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await Loans.updateLoan(Number(id), { book_id, user_id, loan_date, return_date, status });

    if (!updated) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json({ message: "Loan updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update loan", details: error.message });
  }
});

// DELETE: Hapus peminjaman berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Loans.deleteLoan(Number(id));

    if (!deleted) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete loan", details: error.message });
  }
});

module.exports = router;
