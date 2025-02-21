const db = require("../config/database");

class User {
  static async getAll() {
    const [rows] = await db.query("SELECT id, name, username, email, phone FROM users");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT id, name, username, email, phone FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async findByPk(id) {
    return this.getById(id);
  }

  static async create(name, username, email, phone, password) {
    const [result] = await db.query("INSERT INTO users (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)", [name, username, email, phone, password]);
    return result.insertId;
  }

  static async update(id, { name, username, email, phone, password }) {
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (username) {
      updates.push("username = ?");
      values.push(username);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (password) {
      updates.push("password = ?");
      values.push(password);
    }

    if (updates.length === 0) return false; // Tidak ada perubahan

    values.push(id);
    const [result] = await db.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async getByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }
}

module.exports = User;
