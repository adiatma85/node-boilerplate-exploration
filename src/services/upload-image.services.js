const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
// const cloudinary = require('cloudinary').v2;
// const Formidable = require('formidable');
const config = require('../config/config');

const storage = new GridFsStorage({
  url: config.mongoose.url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

const uploadFile = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFile);

module.exports = {
  uploadFilesMiddleware,
};
