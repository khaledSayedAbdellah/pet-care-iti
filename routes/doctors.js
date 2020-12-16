var express = require('express');
var router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const doctorModel = require('../model/clinicModel');
const userModel = require('../model/userModel');
const servicesModel = require('../model/doctorServices');

var upload = require('../services/upload');


const bcrypt = require('bcrypt');

const signToken = util.promisify(jsonwebtoken.sign);
const verifyToken = util.promisify(jsonwebtoken.verify);

constDataFile = require("../constData")

const {secretKey} = constDataFile;



router.post('/signup', upload.single('image'), function (req, res, next) {

  doctorModel.findOne({ email: req.body.email }).then(async user => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    } else {

      try {
        let services = [];
        for(let index in req.body.services){
          let servicObj = await servicesModel.findOne({"_id": req.body.services[index]});
          services.push(servicObj);
        }
        req.body.services = services;

        const insertData = doctorModel(req.body);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(insertData.password, salt, (err, hash) => {
            if (err) console.log(req.body.password);
            insertData.password = hash;
            if(req.file)
              insertData.image = `/images/${req.file.filename}`

            insertData.save().
              then((data) => {
                signToken({userId: data._id},secretKey,(err, token)=>{
                  if(err) res.status(400).send({ status: false, message: "faild operation"});
                  else res.status(200).send({ status: true, message: "sucsess operation",token: token});
                });
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

  const userTemp = await doctorModel.findOne({ email: req.body.email }, { '__v': 0 });

  const user = await doctorModel.findOne({ email: req.body.email }, { "_id": 0,'__v': 0 });
  if (user) {
    try {
      const insertData = doctorModel(req.body);
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

router.patch('/', async (req, res, next)=>{
  
  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const doctorObj = await doctorModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(doctorObj){
      doctorModel.findByIdAndUpdate(tokenResult.userId ,req.body,
         function(err, result){
          if(err){
            return res.status(400).json({ status: false, message: "ensure reservationId is valid and rate is valid" });
          }
          else{
            return res.status(200).json({ status: true, message: "success operation" })
          }
        })

    }else{
      return res.status(400).json({ status: false, message: "ensure that body and token is valid data" });
    }
  }
});

router.get('/', async (req, res, next)=> {

  if(req.query['name'] || req.query['address'] || req.query['rate']){
    


    if(req.query['name'])
      req.query['name'] = { "$regex": req.query['name'], "$options": "i" };


    if(req.query['address'])
      req.query['address']= { "$regex": req.query['address'], "$options": "i" };

    if(req.query['rate'])
      req.query['rate']= { $gte: req.query["rate"]};


    doctorModel.find(req.query,{password:0,__v:0},function (err, data) {
      if (err) {
        return res.status(400).json({ status: false, message: "error ocurred please try again" });
      } else{
        return res.status(200).json({ status: true, data: data });
      }   
    });

    //return res.status(200).json({ status: true, data: req.query});

  } else {
    doctorModel.find({},{password:0,__v:0},function (err, data) {
      if (err) {
        return res.status(400).json({ status: false, message: "error ocurred please try again" });
      } else{
        return res.status(200).json({ status: true, data: data });
      }   
    });
  };
    

});

router.get('/:id', async (req, res, next)=> {

  let doctorId =  req.params.id;
  console.log(doctorId);
  doctorModel.findOne({"_id": doctorId},{password:0,__v:0},function (err, data) {
    if (err) {
      return res.status(400).json({ status: false, message: "error ocurred please try again" });
    } else{
      return res.status(200).json({ status: true, data: data });
    }   
  });

  // const {authorization} = req.headers;
  // let tokenResult;
  // try{
  //   tokenResult = await verifyToken(authorization,secretKey);
  // }catch(e){
  //   return res.status(400).json({ status: false, message: "invalid token" });
  // }

  // if(authorization){
  //   const user = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
  //   if(user){
  //     doctorModel.find(function (err, data) {
  //       if (err) {
  //         return res.status(400).json({ status: false, message: "error ocurred please try again" });
  //       } else{
  //         return res.status(200).json({ status: true, data: data });
  //       }   
  //     });
  //   }else{
  //     return res.status(400).json({ status: false, message: "token not found" });
  //   }

  // }

    

});

router.patch('/servicses', async (req, res, next)=>{
  
  
  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const doctorObj = await doctorModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(doctorObj){

  
      if(req.body.status == -1){
        for(let i=0;i<doctorObj.services.length;i++){
          if(`${doctorObj.services[i]._id}` == req.body.serviceId){        
            doctorObj.services.splice(i, 1);
          }
        }
      }
      
      if(req.body.status == 1){
        for(let i=0;i<doctorObj.services.length;i++){
          if(`${doctorObj.services[i]._id}` == req.body.serviceId){        
            return res.status(200).json({ status: true, message: "service alredy exist" });;
          }
        }
        let addedService = await servicesModel.findOne({_id: req.body.serviceId});
        doctorObj.services.push(addedService);
      }
      
      doctorModel.findByIdAndUpdate(tokenResult.userId ,{services: doctorObj.services},
         function(err, result){
          if(err){
            return res.status(400).json({ status: false, message: "ensure reservationId is valid and rate is valid" });
          }
          else{
            return res.status(200).json({ status: true, message: "success operation",data: {services: doctorObj.services} })
          }
        })

    }else{
      return res.status(400).json({ status: false, message: "ensure that body and token is valid data" });
    }
  }
});


module.exports = router;
