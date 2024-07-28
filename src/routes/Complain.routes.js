const express = require('express');
const { complainCreate, complainList } = require("../controller/complainController.js");

const router = express.Router();

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);


module.exports = router;