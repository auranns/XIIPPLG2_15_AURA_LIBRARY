const db = require("../config/database");

class Loans {
  // Fungsi untuk menambahkan peminjaman
  static async addLoan({ book_id, user_id, loan_date, return_date, status }) {
    try {
      const query = `
        INSERT INTO loans (book_id, user_id, loan_date, return_date, status) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [book_id, user_id, loan_date, return_date, status]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk mendapatkan semua peminjaman
  static async getAllLoans() {
    try {
      const [results] = await db.query("SELECT * FROM loans");
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk mendapatkan peminjaman berdasarkan ID
  static async getLoanById(id) {
    try {
      const [result] = await db.query("SELECT * FROM loans WHERE id = ?", [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk memperbarui peminjaman
  static async updateLoan(id, { book_id, user_id, loan_date, return_date, status }) {
    try {
      const query = `
        UPDATE loans 
        SET book_id = ?, user_id = ?, loan_date = ?, return_date = ?, status = ? 
        WHERE id = ?
      `;
      const [result] = await db.query(query, [book_id, user_id, loan_date, return_date, status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk menghapus peminjaman
  static async deleteLoan(id) {
    try {
      const [result] = await db.query("DELETE FROM loans WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Loans;
