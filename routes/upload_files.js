var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");


const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1000000
  }
})

router.post("/upload", upload.single('image'), (req, res) => {
  res.json({
      status: true,
      url: `/images/${req.file.filename}`,
  })
})


module.exports = router;
