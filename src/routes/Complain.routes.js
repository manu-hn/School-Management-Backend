const express = require('express');
const { complainCreate, complainList } = require("../controller/complainController.js");

const router = express.Router();

router.post('/create-complaint', complainCreate);

router.get('/get-complaint/:id', complainList);


module.exports = router;