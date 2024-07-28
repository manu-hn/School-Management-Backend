const express = require('express');
const { deleteNotice, deleteNotices, noticeCreate, noticeList, updateNotice } = require("../controller/noticeController.js")

const router = express.Router();
router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)


module.exports = router;