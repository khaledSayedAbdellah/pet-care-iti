var express = require('express');
var router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const userModel = require('../model/userModel');

const bcrypt = require('bcrypt');

const signToken = util.promisify(jsonwebtoken.sign);
const verifyToken = util.promisify(jsonwebtoken.verify);

constDataFile = require("../constData")

const {secretKey} = constDataFile;



router.post('/signup', function (req, res, next) {

  userModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    } else {

      try {
        const insertData = userModel(req.body);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(insertData.password, salt, (err, hash) => {
            if (err) console.log(req.body.password);
            insertData.password = hash;

            insertData.save().
              then((data) => {
                res.status(200).send({ status: true, message: "sucsess operation" });
              }).catch((err) => {
                res.status(400).send({ status: false, message: err.message });
              });
          });
        });

      } catch (e) {
        res.status(500).send({ status: false, message: e.message });
      }

    }
  });


});

router.post('/login', async (req, res, next) => {

  
  const userTemp = await userModel.findOne({ email: req.body.email }, { '__v': 0 });

  const user = await userModel.findOne({ email: req.body.email }, { "_id": 0,'__v': 0 });
  if (user) {
    try {
      const insertData = userModel(req.body);
      const match = await bcrypt.compare(req.body.password, user.password)
      if (match) {
        const token = await signToken({userId: userTemp._id},secretKey);

        user.password = undefined;

        res.status(200).send({ status: true, data: JSON.parse(JSON.stringify(user)),token:token });
      } else {
        res.status(400).send({ status: false, message: "password not correct" });
      }
    } catch (e) {
      res.status(500).send({ status: false, message: e.message });
    }

  } else {
    return res.status(400).json({ status: false, message: "email not exist" });
  }

});

router.get('/get', async (req, res, next)=> {

  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }

  if(authorization){
    const user = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(user){
      userModel.find(function (err, data) {
        if (err) {
          return res.status(400).json({ status: false, message: "error ocurred please try again" });
        } else{
          return res.status(200).json({ status: true, data: data });
        }   
      });
    }else{
      return res.status(400).json({ status: false, message: "token not found" });
    }

  }

    

});


module.exports = router;
