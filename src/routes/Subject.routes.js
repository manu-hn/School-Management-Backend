const express = require('express');
const { allSubjects, classSubjects, deleteSubject, deleteSubjects, deleteSubjectsByClass, freeSubjectList, getSubjectDetail, subjectCreate, } = require('../controller/subjectController.js');


const router = express.Router();

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail)

router.delete("/Subject/:id", deleteSubject)
router.delete("/Subjects/:id", deleteSubjects)
router.delete("/SubjectsClass/:id", deleteSubjectsByClass)



module.exports = router;