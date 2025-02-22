const db = require("../config/database");

class Books {
  // Fungsi untuk menambahkan buku
  static async addBook(book) {
    const { title, author, isbn, published_year, price, stock } = book;
    const query = `
      INSERT INTO books (title, author, isbn, published_year, price, stock, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(query, [title, author, isbn, published_year, price, stock]);
    return result.insertId;
  }

  // Fungsi untuk mendapatkan semua buku
  static async getAllBooks() {
    const [rows] = await db.query("SELECT * FROM books");
    return rows;
  }

  // Fungsi untuk mendapatkan buku berdasarkan ID
  static async getBookById(id) {
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Fungsi untuk memperbarui buku
  static async updateBook(id, book) {
    const { title, author, isbn, published_year, price, stock } = book;
    const query = `
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, published_year = ?, price = ?, stock = ? 
      WHERE id = ?
    `;
    const [result] = await db.query(query, [title, author, isbn, published_year, price, stock, id]);
    return result.affectedRows > 0;
  }

  // Fungsi untuk menghapus buku
  static async deleteBook(id) {
    const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Books;
