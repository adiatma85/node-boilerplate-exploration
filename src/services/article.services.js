const httpStatus = require('http-status');
const { Article } = require('../models');
const ApiError = require('../utils/ApiError');

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
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryArticle = async (filter, options) => {
  const articles = await Article.paginate(filter, options);
  return articles;
};

/**
 *
 * @param {ObjectId} id
 * @returns
 */
const getArticleById = async (id) => {
  return Article.findById(id);
};

/**
 * Update article by id
 * @param {ObjectId} articleId
 * @param {Object} updateBody
 * @returns {Promise<Article>}
 */
const updateArticleById = async (articleId, updateBody) => {
  const article = await getArticleById(articleId);

  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  Object.assign(article, updateBody);
  await article.save();
  return article;
};

/**
 * Delete article by id
 * @param {ObjectId} articleId
 * @returns {Prmoise<Article>}
 */
const deleteArticleByid = async (articleId) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  await article.remove();
  return article;
};

module.exports = {
  createArticle,
  queryArticle,
  getArticleById,
  updateArticleById,
  deleteArticleByid,
};
