const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/sit7251db');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const booksRoutes = require('./routes/books.routes');
app.use('/api/books', booksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});