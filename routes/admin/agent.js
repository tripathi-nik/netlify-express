const express = require('express');
const router = express.Router();
const md5 = require('md5');
const Joi = require('joi');
const agent_model = require('../../model/agent');

/*Agent account register*/
router.post('/add', (req,res)=>{
    const schema = {
        first_name:Joi.string().min(3).required(),
        last_name:Joi.string().min(3).required(),
        email_address:Joi.string().email().required(),
        input_password:Joi.string().min(8).required(),
        repeat_password: Joi.any().valid(Joi.ref('input_password')).required().options({ language: { any: { allowOnly: 'must match password' } } })

    };
    const result = Joi.validate(req.body, schema);
    if(result.error)
      res.status(400).send(result.error.details[0].message);
    const agentNew = {
       first_name: req.body.first_name,
       last_name: req.body.last_name,
       email_address: req.body.email_address,
       input_password: md5(req.body.input_password),
    };
    let agentRecord = agent_model.agentAdd(agentNew);

    setTimeout(()=>{
    agentRecord.then((result) => {
      res.status(200).send(result);
    }).catch((error) => {
        console.log("Error", error);
    })
    },4000)
});

/*Agent Login Check*/
router.post('/login', (req,res)=>{
  const schema = {
      email_address:Joi.string().email().required(),
      input_password:Joi.string().min(8).required(),
  };
  const result = Joi.validate(req.body, schema);
  if(result.error)
    res.status(400).send(result.error.details[0].message);
  const agentNew = {
     email_address: req.body.email_address,
     input_password: md5(req.body.input_password),
  };

  let agentLogin = agent_model.checkLogin(agentNew);
  setTimeout(()=>{
  agentLogin.then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
      console.log("Error", error);
  })
},3000)
});

module.exports=router;
