const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
// const { Article } = require('../../src/models');
const {
  insertArticles,
  rightArticle,
  wrongArticle,
  articleWithPrefixNameA,
  articleWithPrefixNameZ,
} = require('../fixtures/article.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Article routes', () => {
  describe('POST /v1/articles', () => {
    let newArticle;

    beforeEach(() => {
      newArticle = {
        name: faker.name.findName(),
        content: faker.lorem.paragraphs(),
      };
    });

    test('should return 201 and successfully create new article if data is ok', async () => {
      await insertArticles([rightArticle]);

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
    });

    test('should return 401 if no access token provided', async () => {
      await request(app).post('/v1/users').send(newArticle).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/articles', () => {
    test('should return 200 and apply default query options', async () => {
      await insertArticles([rightArticle, wrongArticle]);

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
        totalResults: 2,
      });

      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: rightArticle._id.toHexString(),
        name: rightArticle.name,
        content: rightArticle.content,
      });
    });

    test('should return 401 if no access token provided', async () => {
      await request(app).post('/v1/users').expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on name field', async () => {
      await insertArticles([articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: articleWithPrefixNameA.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });

      expect(res.body.results[0].id).toBe(articleWithPrefixNameA._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertArticles([articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(articleWithPrefixNameZ._id.toHexString());
      expect(res.body.results[1].id).toBe(articleWithPrefixNameA._id.toHexString());
    });
  });
});
