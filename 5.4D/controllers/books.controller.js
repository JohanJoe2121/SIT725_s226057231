const booksService = require('../services/books.service');

const allowedFields = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price', 'currency'];
const updateAllowedFields = ['title', 'author', 'year', 'genre', 'summary', 'price', 'currency'];

function findUnknownFields(body, allowed) {
  return Object.keys(body).filter((key) => !allowed.includes(key));
}

function formatValidationError(err) {
  if (err && err.name === 'ValidationError' ) {
    return Object.values(err.errors).map(e => e.message).join('; ');
  }
  if (err && err.name === 'CastError') {
    return `${err.path} has invalid type`;
  }
  return err.message || 'Validation error';
}

exports.getAllBooks = async (_req, res, next) => {
  try {
    const items = await booksService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: items,
      message: 'Books retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const item = await booksService.getBookById(req.params.id);

    if (!item) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: item,
      message: 'Book retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res) => {
  try {
    const unknownFields = findUnknownFields(req.body, allowedFields);

    if (unknownFields.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: `Unknown fields are not allowed: ${unknownFields.join(', ')}`
      });
    }

    const created = await booksService.createBook(req.body);

    return res.status(201).json({
      statusCode: 201,
      data: created.toJSON(),
      message: 'Book created successfully'
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Duplicate id already exists'
      });
    }

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        statusCode: 400,
        message: formatValidationError(err)
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    if ('id' in req.body) {
      return res.status(400).json({
        statusCode: 400,
        message: 'id is immutable and cannot be changed'
      });
    }

    const unknownFields = findUnknownFields(req.body, updateAllowedFields);

    if (unknownFields.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: `Unknown fields are not allowed: ${unknownFields.join(', ')}`
      });
    }

    const updated = await booksService.updateBookById(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: updated,
      message: 'Book updated successfully'
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        statusCode: 400,
        message: formatValidationError(err)
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};