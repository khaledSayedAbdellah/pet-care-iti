var express = require('express');
var multer = require("multer");
var path = require("path");


module.exports = multer({
  storage: multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  }),
  limits: {
      fileSize: 1000000
  }
});
