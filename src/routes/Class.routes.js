const express = require('express');
const { deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents, sclassCreate, sclassList } = require('../controller/classController.js');

const router = express.Router();

router.post('/SclassCreate', sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail)

router.get("/Sclass/Students/:id", getSclassStudents)

router.delete("/Sclasses/:id", deleteSclasses)
router.delete("/Sclass/:id", deleteSclass)


module.exports = router;