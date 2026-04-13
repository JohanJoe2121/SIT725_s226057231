const Book = require('../models/books.model');

async function getAllBooks() {
  return Book.find({}).lean({ getters: true });
}

async function getBookById(id) {
  return Book.findOne({ id }).lean({ getters: true });
}

async function createBook(data) {
  const book = new Book(data);
  return book.save();
}

async function updateBookById(id, updateData) {
  return Book.findOneAndUpdate(
    { id },
    { $set: updateData },
    {
      new: true,
      runValidators: true
    }
  ).lean({ getters: true });
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById
};