const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const articleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
