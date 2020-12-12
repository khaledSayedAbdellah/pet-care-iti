var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");

var upload = require('../services/upload');


router.post("/upload", upload.single('image'), (req, res) => {
  res.json({
      status: true,
      url: `/images/${req.file.filename}`,
  })
})


module.exports = router;
