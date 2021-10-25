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

    test('should correctly apply filter on name field', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ name: articleOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.anything(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(articleOne._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.anything(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(articleWithPrefixNameZ._id.toHexString());
      expect(res.body.results[1].id).toBe(articleWithPrefixNameA._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.anything(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(articleOne._id.toHexString());
      expect(res.body.results[1].id).toBe(articleTwo._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified even page limitation', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ sortBy: '_id:desc', limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.anything(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(articleWithPrefixNameZ._id.toHexString());
      expect(res.body.results[1].id).toBe(articleWithPrefixNameA._id.toHexString());
    });

    test('should return the correct page if page and limit param are specified', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo, articleWithPrefixNameA, articleWithPrefixNameZ]);

      const res = await request(app)
        .get('/v1/articles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ limit: 2, page: 2, sortBy: '_id:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.anything(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(articleWithPrefixNameA._id.toHexString());
      expect(res.body.results[1].id).toBe(articleWithPrefixNameZ._id.toHexString());
    });
  });

  describe('GET /v1/articles/:articleId', () => {
    test('admin can access particular article and should return 200 and the article object if data is ok', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne, articleTwo]);

      const res = await request(app)
        .get(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: articleOne._id.toHexString(),
        name: articleOne.name,
        content: articleOne.content,
      });
    });

    test('user can access particular article and should return 200 and the article object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo]);

      const res = await request(app)
        .get(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: articleOne._id.toHexString(),
        name: articleOne.name,
        content: articleOne.content,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertArticles([articleOne, articleTwo]);
      await request(app).get(`/v1/articles/${articleOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if articleId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo]);

      await request(app)
        .get(`/v1/articles/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if article not found', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne, articleTwo]);

      await request(app)
        .get(`/v1/articles/${articleWithPrefixNameA._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/articles/:articleId', () => {
    test('should return 204 if admin delete the article and data is ok', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      await request(app)
        .delete(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 403 error if user try to delete an article', async () => {
      await insertUsers([admin, userOne]);
      await insertArticles([articleOne]);

      await request(app)
        .delete(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error access token is missing', async () => {
      await request(app).delete(`/v1/articles/${articleOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if provided article id is not valid mongo id', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      await request(app)
        .delete(`/v1/articles/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if article not found', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      await request(app)
        .delete(`/v1/articles/${articleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/articles/:articleId', () => {
    test('should return 200 and successfully update article if data is ok', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      const updateBody = {
        name: faker.name.findName(),
        content: faker.lorem.paragraphs(),
      };

      const res = await request(app)
        .patch(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: articleOne._id.toHexString(),
        name: updateBody.name,
        content: updateBody.content,
      });

      const dbArticle = await Article.findById(articleOne._id);
      expect(dbArticle).toBeDefined();
      expect(dbArticle).toMatchObject({ name: updateBody.name, content: updateBody.content });
    });

    test('should return 403 error if user try to edit an article', async () => {
      await insertUsers([userOne]);
      await insertArticles([articleOne]);

      const updateBody = {
        name: faker.name.findName(),
        content: faker.lorem.paragraphs(),
      };

      await request(app)
        .patch(`/v1/articles/${articleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error access token is missing', async () => {
      await request(app).patch(`/v1/articles/${articleOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if provided article id is not valid mongo id', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      await request(app)
        .patch(`/v1/articles/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if article not found', async () => {
      await insertUsers([admin]);
      await insertArticles([articleOne]);

      await request(app)
        .delete(`/v1/articles/${articleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
