const express = require('express');
const { deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents, sclassCreate, sclassList } = require('../controller/classController.js');

const router = express.Router();

router.post('/s-class-create', sclassCreate);

router.get('/s-class-list/:id', sclassList);
router.get("/s-class/:id", getSclassDetail)

router.get("/s-class/students/:id", getSclassStudents)

router.delete("/s-classes/:id", deleteSclasses)
router.delete("/s-class/:id", deleteSclass)


module.exports = router;