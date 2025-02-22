const express = require("express");
const router = express.Router();
const Books = require("../models/Books");

// Route untuk menambahkan buku
router.post("/", async (req, res) => {
  try {
    const { title, author, isbn, published_year, price, stock } = req.body;

    if (!title || !author || !isbn || !published_year || !price || !stock) {
      return res.status(400).json({ message: "Semua kolom wajib diisi" });
    }

    const bookId = await Books.addBook({ title, author, isbn, published_year, price, stock });
    res.status(201).json({ message: "Buku berhasil ditambahkan", bookId });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan buku", error: error.message });
  }
});

// Route untuk mendapatkan semua buku
router.get("/", async (req, res) => {
  try {
    const books = await Books.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data buku", error: error.message });
  }
});

// Route untuk mendapatkan buku berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Books.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data buku", error: error.message });
  }
});

// Route untuk memperbarui buku
router.put("/:id", async (req, res) => {
  try {
    const { title, author, isbn, published_year, price, stock } = req.body;

    if (!title || !author || !isbn || !published_year || !price || !stock) {
      return res.status(400).json({ message: "Semua kolom wajib diisi" });
    }

    const updated = await Books.updateBook(req.params.id, { title, author, isbn, published_year, price, stock });
    if (!updated) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    res.status(200).json({ message: "Buku berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui buku", error: error.message });
  }
});

// Route untuk menghapus buku
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Books.deleteBook(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus buku", error: error.message });
  }
});

module.exports = router;
