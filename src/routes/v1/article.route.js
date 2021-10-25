const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articleValidation = require('../../validations/article.validation');
const articleController = require('../../controllers/article.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createArticles'), validate(articleValidation.createArticle), articleController.createArticle)
  .get(auth('getArticles'), validate(articleValidation.getArticles), articleController.getArticles);

router.route('/testing').post(articleController.testing);

router
  .route('/:articleId')
  .get(auth('getArticles'), validate(articleValidation.getArticle), articleController.getArticle)
  .patch(auth('updateArticles'), validate(articleValidation.updateArticle), articleController.updateArticle)
  .delete(auth('deleteArticles'), validate(articleValidation.deleteArticle), articleController.deleteArticle);

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
 *     description: Only with create_article permission can create article.
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
 *
 *   get:
 *     summary: Get all articles
 *     description: Only with get_all_article permissions can access.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get a particular article
 *     description: Only with the get_article permission can do this operation
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an article
 *     description: Only with the update_article and corresponding can do this operation
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
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
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an article
 *     description: Only with delete_article permissions can delete the article.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article Id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
