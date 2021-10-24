const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Article } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const {
  articleOne,
  articleTwo,
  articleWithPrefixNameA,
  articleWithPrefixNameZ,
  insertArticles,
} = require('../fixtures/article.fixture');
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

  describe('GET /v1/articles', () => {
    test('admin can get all articles and should return 200 and apply default query options', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0]).toEqual({
        id: articleOne._id.toHexString(),
        name: articleOne.name,
        content: articleOne.content,
      });
    });

    test('user can get all articles and should return 200 and apply default query options', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0]).toEqual({
        id: articleOne._id.toHexString(),
        name: articleOne.name,
        content: articleOne.content,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/articles').send().expect(httpStatus.UNAUTHORIZED);
    });
  });
});
