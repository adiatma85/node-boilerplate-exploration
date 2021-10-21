const mongoose = require('mongoose');
const faker = require('faker');
const Article = require('../../src/models/article.model');

const wrongArticle = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  content: faker.lorem.paragraphs(),
};

const rightArticle = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  content: faker.lorem.paragraphs(),
};

const articleWithPrefixNameA = {
  _id: mongoose.Types.ObjectId(),
  name: 'Artikel Satu',
  content: faker.lorem.paragraphs(),
};

const articleWithPrefixNameZ = {
  _id: mongoose.Types.ObjectId(),
  name: 'ZArtikel Satu',
  content: faker.lorem.paragraphs(),
};

const insertArticles = async (articles) => {
  await Article.insertMany(articles.map((article) => ({ ...article })));
};

module.exports = {
  wrongArticle,
  rightArticle,
  articleWithPrefixNameA,
  articleWithPrefixNameZ,
  insertArticles,
};
