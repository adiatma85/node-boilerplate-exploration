const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Article } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
// const { rightArticle, insertArticles } = require('../fixtures/article.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Article Routes', () => {
  describe('POST /v1/articles', () => {
    let newArticle;

    beforeEach(() => {
      newArticle = {
        name: faker.name.findName(),
        content: faker.lorem.paragraphs(),
      };
    });

    test('should return 201 and successfully create new article if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/articles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newArticle)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newArticle.name,
        content: newArticle.content,
      });

      const dbArticle = await Article.findById(res.body.id);
      expect(dbArticle).toBeDefined();
      expect(dbArticle).toMatchObject({ name: newArticle.name, content: newArticle.content });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/articles').send(newArticle).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user want to create article', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newArticle)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
