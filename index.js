const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();


// app.use('',)


app.listen(PORT,function(){
    console.log(`Server is running on PORT ${PORT}`);
})