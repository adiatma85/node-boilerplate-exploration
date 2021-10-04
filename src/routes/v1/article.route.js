const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articleValidation = require('../../validations/article.validation');
const articleController = require('../../controllers/article.controller');

const router = express.Router();

router.route('/').post(validate(articleValidation.createArticle), articleController.createArticle);
//   .get(validate(articleValidation.getArticle), articleController.getArticle);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Articles
 *  description: Article management and retrieval
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a article
 *     description: Only admins can create article.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                  type: string
 *             example:
 *               name: Ini judul artikel yang ndak perlu panjang-panjang
 *               content: Ini konten yang panjang dan lebar hehe
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
