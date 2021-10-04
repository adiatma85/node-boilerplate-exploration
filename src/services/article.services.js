// const httpStatus = require('http-status')
const { Article } = require('../models');
// const ApiError = require('../utils/ApiError');

const createArticle = async (articleBody) => {
  return Article.create(articleBody);
};

const testing = async () => {
  return 'Hello world';
};

module.exports = {
  createArticle,
  testing,
};
