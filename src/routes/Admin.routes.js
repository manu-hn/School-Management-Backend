const express = require('express');
const { adminRegister, adminLogIn, getAdminDetail } = require('../controller/adminController.js');


const router = express.Router();
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)

module.exports = router;