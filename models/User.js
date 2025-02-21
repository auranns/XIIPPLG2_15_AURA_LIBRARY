const db = require("../config/database");

class User {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(name, email, password) {
    const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    return result.insertId;
  }

  static async update(id, name, email, password) {
    const [result] = await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async getByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async findByPk(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }
}

module.exports = User;
