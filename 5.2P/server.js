const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const booksRoutes = require('./routes/books.routes');
app.use('/api/books', booksRoutes);

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});