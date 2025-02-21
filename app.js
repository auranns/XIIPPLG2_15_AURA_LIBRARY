// File: app.js
const express = require("express");
const categoriesRouter = require("./routes/categories");
const UserRouter = require("./routes/user");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

const app = express();
app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api", UserRouter);

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
