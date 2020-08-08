const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const devDebug = require('debug')('app:fix');
const errDebug=require('debug')('app:exception');
const config = require('config');

mongoose.connect(config.get('database'))
.then(()=>devDebug('connected successfully to database'))
.catch(err=>errDebug('could not connect to database'));

const agentSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    last_name: {
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    email_address: {
        type: String,
        match: [
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please add a valid email address.',
        ],
        required: [true, 'Please enter Email Address'],
        index: true,
        unique: true,
        lowercase: true,
        dropDups: true
    },
    input_password: {
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
});
 agentSchema.plugin(uniqueValidator);
const Agents = mongoose.model('Agents',agentSchema);

async function agentAdd(value){
    const agent = new Agents(value);
    try{
        const result = await agent.save();
        return result._id;
    }catch(exp){
        for(field in exp.errors)
            return '"'+exp.errors[field].path+'"';
            console.log(exp.errors[field]);
    }

}

async function checkLogin(value){
    let agent = await Agents.find({email_address:value.email_address})
    .select({_id:1});
    if(agent[0]){
      agent = await Agents.find({email_address:value.email_address,input_password:value.input_password})
      .select({_id:1,first_name:1,last_name:1});
      if(agent[0]){
        return agent[0];
      }
      else{
        return {status_code:400,error:'input_password'};
      }
    }
    else{
      return {status_code:400,error:'email_address'};
    }

}
module.exports = {
  agentAdd,
  checkLogin
}
