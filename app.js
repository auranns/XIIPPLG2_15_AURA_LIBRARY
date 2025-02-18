// File: app.js
const express = require('express');
const categoriesRouter = require('./routes/categories');

const app = express();
app.use(express.json());

app.use('/api/categories', categoriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;