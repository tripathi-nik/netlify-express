const express = require('express');
const app = express();
const agent = require('./routes/admin/agent');
const home = require('./routes/home');
const cors = require('cors');
app.use(cors());

app.use(function(req,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
    if(sent) return;
    _send.bind(res)(data);
    sent = true;
};
  next();
});

app.use(express.json());
app.use('/api/agent',agent);
app.use('/',home);

console.log('Welcome to new project');
const port = process.env.PORT || 3000;

app.listen(port,()=>console.log(`listing to port ${port}`));
