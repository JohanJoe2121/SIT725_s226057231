const Book = require('../models/books.model');

async function getAllBooks() {
  return Book.find({}).lean({ getters: true });
}

async function getBookById(id) {
  return Book.findOne({ id }).lean({ getters: true });
}

module.exports = {
  getAllBooks,
  getBookById
};