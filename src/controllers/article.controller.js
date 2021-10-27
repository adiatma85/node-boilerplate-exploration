const httpStatus = require('http-status');
const { uploader } = require('cloudinary').v2;
const { dataUri } = require('../middlewares/multer');
const cloudinaryUpload = require('../utils/cloudinary');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { articleService } = require('../services');

const createArticle = catchAsync(async (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    const imageUrl = await cloudinaryUpload(file);
    req.body.image_url = imageUrl;
  }
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

const testingCloudinary = catchAsync(async (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;

    return uploader
      .upload(file)
      .then((result) => {
        const image = result.url;
        return res.status(200).json({
          message: 'The image is uploaded',
          data: {
            image,
          },
        });
      })
      .catch((err) =>
        res.status(400).json({
          messge: 'someting went wrong while processing your request',
          data: {
            err,
          },
        })
      );
  }
});

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  testingCloudinary,
};
