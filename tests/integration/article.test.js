const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const {
  insertArticles,
  rightArticle,
  // wrongArticle,
  // articleWithPrefixNameA,
  // articleWithPrefixNameZ,
} = require('../fixtures/article.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Article routes', () => {
  describe('User routes', () => {
    describe('POST /v1/articles', () => {
      let newArticle;

      beforeEach(() => {
        newArticle = {
          name: faker.name.findName(),
          content: faker.lorem.paragraphs(),
        };
      });

      test('should return 201 and successfully create new user if data is ok', async () => {
        await insertArticles([rightArticle]);

        await request(app)
          .post('/v1/articles')
          .set({ Authorization: `Bearer ${adminAccessToken}` })
          .send(newArticle)
          .expect(httpStatus.CREATED);
      });
    });
  });
});
