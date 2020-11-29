var express = require('express');
var router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const serviceModel = require('../model/doctorServices');

const bcrypt = require('bcrypt');

const signToken = util.promisify(jsonwebtoken.sign);
const verifyToken = util.promisify(jsonwebtoken.verify);

constDataFile = require("../constData")

const {secretKey} = constDataFile;

router.put('/',async(req,res,next)=>{
  const insertData = serviceModel(req.body);
  insertData.save().
  then((data) => {
    res.status(200).send({ status: false, data: data });
  }).catch((err) => {
    res.status(400).send({ status: false, message: err.message });
  });
});

router.get('/', async (req, res, next)=> {

  const services = await serviceModel.find({},{ '__v': 0 });
  if(!services){
    return res.status(400).json({ status: false, message: "error ocurred please try again" });
  } else{
    return res.status(200).json({ status: true, data: services });
  }

    

});

router.get('/:id', async (req, res, next)=> {

  let id = req.params.id;


  const service = await serviceModel.findOne({"_id": id},{ '__v': 0 });
  if(!service){
    return res.status(400).json({ status: false, message: "error ocurred please try again" });
  } else{
    return res.status(200).json({ status: true, data: service });
  }
});

module.exports = router;
