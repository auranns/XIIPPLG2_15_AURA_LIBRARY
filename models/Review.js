const db = require("../config/database");

class Review {
  // Fungsi untuk menambahkan ulasan
  static async addReview(review) {
    const { book_id, user_id, rating, comment } = review;
    const query = "INSERT INTO reviews (book_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())";
    const [result] = await db.query(query, [book_id, user_id, rating, comment]);
    return result.insertId;
  }

  // Fungsi untuk mendapatkan semua ulasan
  static async getAllReviews() {
    const [rows] = await db.query("SELECT * FROM reviews");
    return rows;
  }

  // Fungsi untuk memperbarui ulasan
  static async updateReview(id, review) {
    const { book_id, user_id, rating, comment } = review;
    const query = "UPDATE reviews SET book_id = ?, user_id = ?, rating = ?, comment = ? WHERE id = ?";
    const [result] = await db.query(query, [book_id, user_id, rating, comment, id]);
    return result.affectedRows > 0;
  }

  // Fungsi untuk menghapus ulasan
  static async deleteReview(id) {
    const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Review;
