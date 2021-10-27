const { config, uploader } = require('cloudinary').v2;
const { cloudinary } = require('./config');

const cloudinaryConfig = () =>
  config({
    cloud_name: cloudinary.cloud_name,
    api_key: cloudinary.api_key,
    api_secret: cloudinary.secret_key,
  });

module.exports = {
  cloudinaryConfig,
  uploader,
};
