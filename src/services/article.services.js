// const httpStatus = require('http-status')
const { Article } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 *
 * @param {Object} articleBody
 * @returns { Promise<Article> }
 */
const createArticle = async (articleBody) => {
  return Article.create(articleBody);
};

/**
 *
 * @param {ObjectId} id
 * @returns
 */
const getArticleById = async (id) => {
  return Article.findById(id);
};

const testing = async () => {
  return 'Hello world';
};

module.exports = {
  createArticle,
  getArticleById,
  testing,
};
