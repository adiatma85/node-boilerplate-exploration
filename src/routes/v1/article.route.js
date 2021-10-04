const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articleValidation = require('../../validations/article.validation');
const articleController = require('../../controllers/article.controller');

const router = express.Router();

router.route('/').post(validate(articleValidation.createArticle), articleController.createArticle);
//   .get(validate(articleValidation.getArticle), articleController.getArticle);

module.exports = router;
