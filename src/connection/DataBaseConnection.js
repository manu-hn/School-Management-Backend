const { connect } = require('mongoose');
require('dotenv').config();

const URL = process.env.MONGO_URL

connect(URL).then(function () {
    console.log('MongoDB is Connected!')
}).catch(function (err) {
    console.error(`Database Connection Error !`,err)
})