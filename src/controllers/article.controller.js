const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { articleService, testingUploadingImage } = require('../services');

const createArticle = catchAsync(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(httpStatus.CREATED).send(article);
});

const getArticles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await articleService.queryArticle(filter, options);
  res.send(result);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

const updateArticle = catchAsync(async (req, res) => {
  const article = await articleService.updateArticleById(req.params.articleId, req.body);
  res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
  await articleService.deleteArticleByid(req.params.articleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const testing = catchAsync(async (req, res) => {
  try {
    await testingUploadingImage.uploadFilesMiddleware(req, res);

    // console.log(req.file);
    if (req.file === undefined) {
      return res.send(`You must select a file.`);
    }

    return res.send(`File has been uploaded.`);
  } catch (error) {
    // console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
});

const testingCloudinary = catchAsync(async (req, res) => {
  // await testingUploadingImage.cloudinaryUpdate(req, res);
  console.log(req.file);
  res.send({
    file: req.file.filename,
  });
});

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  testing,
  testingCloudinary,
};
