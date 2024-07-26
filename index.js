const express = require('express');
 require('./src/connection/DataBaseConnection.js');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();


app.use(express.json({limit : '20mb'}));
app.use(cors());

// app.use('',)


app.listen(PORT,function(){
    console.log(`Server is running on PORT ${PORT}`);
})