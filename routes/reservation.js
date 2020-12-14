var express = require('express');
var router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const reservationModel = require('../model/reservation');
const doctorModel = require('../model/clinicModel');
const userModel = require('../model/userModel');
const servicesModel = require('../model/doctorServices');

const bcrypt = require('bcrypt');

const signToken = util.promisify(jsonwebtoken.sign);
const verifyToken = util.promisify(jsonwebtoken.verify);

constDataFile = require("../constData")

const {secretKey} = constDataFile;



router.get('/:id', async (req, res, next)=> {

  let id = req.params.id;

  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const doctorObjToken = await doctorModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    const userObjToken = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(doctorObjToken || userObjToken){
      reservationModel.findOne({ "_id": id },async (err, data)=> {
        if (err) {
          return res.status(400).json({ status: false, message: "error ocurred please try again" });
        } else{
          let resultData = {};
          const userObj = await userModel.findOne({ _id: data.userId }, { '_id':0,'password':0,'__v': 0 });
          if(userObj){
            resultData = {
              user: userObj,
              status: data.status,
              services: data.services,
              rate: data.rate,
              date: data.date,
              id:  data._id,
              AWT: null,
            };
          }
          return res.status(200).json({ status: true, data: resultData });
        }   
      });
    }else{
      return res.status(400).json({ status: false, message: "token not found" });
    }

  }
});


router.get('/', async (req, res, next)=> {

  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const doctorObj = await doctorModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    const userObj = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(doctorObj || userObj){
      reservationModel.find(doctorObj?{ doctorId: tokenResult.userId }:{ userId: tokenResult.userId },async (err, data)=> {
        if (err) {
          return res.status(400).json({ status: false, message: "error ocurred please try again" });
        } else{
          let resultData = [];
          for(let obj in data){
            const userObj = await userModel.findOne({ _id: data[obj].userId }, { '_id':0,'password':0,'__v': 0 });
            if(userObj){
              resultData.push(
                {
                  user: userObj,
                  status: data[obj].status,
                  services: data[obj].services,
                  rate: data[obj].rate,
                  date: data[obj].date,
                  id:  data[obj]._id,
                  AWT: null,
                }
              );
            }
          }
          return res.status(200).json({ status: true, data: resultData });
        }   
      });
    }else{
      return res.status(400).json({ status: false, message: "token not found" });
    }

  }
});


router.put('/', async (req, res, next)=> {

  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const userObj = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(userObj){
      
      //add user id to body
      req.body.userId = tokenResult.userId;
      // edit services
      let services = [];
      // let servicObj;
        for(let index in req.body.services){
          try{
            var servicObj = await servicesModel.findOne({"_id": req.body.services[index]});
            if(servicObj){
              services.push(servicObj);
            }
          }catch(err){
            var servicObj = await servicesModel.findOne({"title": req.body.services[index]});
            if(servicObj){
              services.push(servicObj);
            }
      
          }
          
        }
        
        req.body.services = services;


      const insertReservationData = reservationModel(req.body);

      insertReservationData.save().
      then((data) => {
        res.status(200).send({ status: true, message: "success operation"});
      }).catch((err) => {
        res.status(400).send({ status: false, message: err.message,error: "error" });
      });

      
    }else{
      return res.status(400).json({ status: false, message: "token not found" });
    }

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
      const reservation = await reservationModel.findOne({ _id: req.body.reservationId });
      if(reservation){
        reservationModel.findByIdAndUpdate(req.body.reservationId ,{"status": req.body.status},
         function(err, result){
          if(err){
            return res.status(400).json({ status: false, message: "ensure reservationId is valid and rate is valid" });
          }
          else{
            return res.status(200).json({ status: true, message: "success" })
          }
        })

      }else{
        return res.status(400).json({ status: false, message: "reservation id must be valud" });
      }
    }else{
      const userObj = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
      if(userObj){
        const reservation = await reservationModel.findOne({ _id: req.body.reservationId });
      if(reservation){
        reservationModel.findByIdAndUpdate(req.body.reservationId ,{"rate": req.body.rate},
         function(err, result){
          if(err){
            return res.status(400).json({ status: false, message: "ensure reservationId is valid and rate is valid" });
          }
          else{
            return res.status(200).json({ status: true, message: "success" })
          }
        })
        //  ><<><><><>><><> database update ><<><><><>><><>
        console("rate: "+req.body.rate);

      }else{
        return res.status(400).json({ status: false, message: "reservation id must be valud" });
      }
      }else{
        return res.status(400).json({ status: false, message: "token not found" });
      }
    }

  }
});


router.delete('/:id', async (req, res, next)=>{
  var reservaitionId = req.params.id;
  if(!reservaitionId){
    return res.status(400).json({ status: false, message: "reservation id required" });
  }
  const {authorization} = req.headers;
  let tokenResult;
  try{
    tokenResult = await verifyToken(authorization,secretKey);
  }catch(e){
    return res.status(400).json({ status: false, message: "invalid token" });
  }
  if(authorization){
    const doctorObj = await doctorModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    const userObj = await userModel.findOne({ _id: tokenResult.userId }, { '__v': 0 });
    if(doctorObj || userObj){
      const reservation = await reservationModel.findOne({ _id: reservaitionId });
      if(reservation){
        //  ><<><><><>><><> database delete ><<><><><>><><>
        const result = await reservationModel.deleteOne({ _id: reservaitionId });
        return res.status(400).json({ status: true, message: "reservation delete succsessfuly" });
      }else{
        return res.status(400).json({ status: false, message: "reservation id must be valid" });
      }
    }else{
      return res.status(400).json({ status: false, message: "invalid token" });
    }

  }else{
    return res.status(400).json({ status: false, message: "token is required in authintication header" });
  }
});



module.exports = router;
