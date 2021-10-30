// Multer and Data Uri middleware
const multer = require('multer');
const DataUri = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });
const dUri = new DataUri();

const dataUri = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = { multerUpload, dataUri };
