const express = require('express');
const { deleteNotice, deleteNotices, noticeCreate, noticeList, updateNotice } = require("../controller/noticeController.js")

const router = express.Router();

router.post('/notice-create', noticeCreate);

router.get('/notice-list/:id', noticeList);

router.delete("/notices/:id", deleteNotices)
router.delete("/notice/:id", deleteNotice)

router.put("/notice/:id", updateNotice)


module.exports = router;