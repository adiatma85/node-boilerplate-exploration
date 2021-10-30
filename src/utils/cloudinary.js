// Global upload for cloudinary services
const { uploader } = require('cloudinary').v2;
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const upload = (file) => {
  return uploader
    .upload(file)
    .then((result) => {
      const imageUrl = result.url;
      return imageUrl;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = upload;
