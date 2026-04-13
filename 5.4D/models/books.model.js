const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required'],
    unique: true,
    index: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
    minlength: [1, 'title cannot be empty'],
    maxlength: [150, 'title is too long']
  },
  author: {
    type: String,
    required: [true, 'author is required'],
    trim: true,
    minlength: [1, 'author cannot be empty'],
    maxlength: [100, 'author is too long']
  },
  year: {
    type: Number,
    required: [true, 'year is required'],
    min: [0, 'year cannot be negative'],
    max: [currentYear + 1, 'year is too far in the future'],
    validate: {
      validator: Number.isInteger,
      message: 'year must be an integer'
    }
  },
  genre: {
    type: String,
    required: [true, 'genre is required'],
    trim: true,
    minlength: [1, 'genre cannot be empty'],
    maxlength: [50, 'genre is too long']
  },
  summary: {
    type: String,
    required: [true, 'summary is required'],
    trim: true,
    minlength: [1, 'summary cannot be empty'],
    maxlength: [2000, 'summary is too long']
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'price is required'],
    get: v => v?.toString(),
    validate: {
      validator: function (v) {
        if (v === undefined || v === null) return false;
        return parseFloat(v.toString()) > 0;
      },
      message: 'price must be greater than 0'
    }
  },
  currency: {
    type: String,
    required: [true, 'currency is required'],
    enum: {
      values: ['AUD'],
      message: 'currency must be AUD'
    },
    default: 'AUD'
  }
}, {
  toJSON: {
    getters: true,
    virtuals: false,
    transform(_doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: { getters: true, virtuals: false }
});

module.exports = mongoose.model('Book', bookSchema);