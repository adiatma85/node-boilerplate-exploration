const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { articleService } = require('../services');

const createArticle = catchAsync(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(httpStatus.CREATED).send(article);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

module.exports = {
  createArticle,
  getArticle,
};
