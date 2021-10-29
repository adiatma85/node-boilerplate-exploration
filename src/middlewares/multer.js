// Global middleware for multer to detect image file
const multer = require('multer');
const Datauri = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const dUri = new Datauri();

const dataUri = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

const multerUpload = (fieldName) => multer({ storage }).single(fieldName);

module.exports = { multerUploads, dataUri, multerUpload };
