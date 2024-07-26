const express = require('express');
const { adminRegister, adminLogIn, getAdminDetail } = require('../controller/adminController.js');


const router = express.Router();
router.post('/admin-registration', adminRegister);
router.post('/admin-login', adminLogIn);

router.get("/admin/:id", getAdminDetail)

module.exports = router;