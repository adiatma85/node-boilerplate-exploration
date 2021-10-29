const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const articleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

articleSchema.pre('save', async function (next) {
  const article = this;
  if (article.isModified('image')) {
    article.image = 'link to image';
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
