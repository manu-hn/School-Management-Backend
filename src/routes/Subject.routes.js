const express = require('express');
const { allSubjects, classSubjects, deleteSubject, deleteSubjects, deleteSubjectsByClass, freeSubjectList, getSubjectDetail, subjectCreate, } = require('../controller/subjectController.js');


const router = express.Router();

router.post('/create-subject', subjectCreate);

router.get('/all-subjects/:id', allSubjects);
router.get('/class-subjects/:id', classSubjects);
router.get('/free-subject-list/:id', freeSubjectList);
router.get("/subject/:id", getSubjectDetail)

router.delete("/delete-subject/:id", deleteSubject)
router.delete("/delete-subjects/:id", deleteSubjects)
router.delete("/delete-subjects-class/:id", deleteSubjectsByClass)


module.exports = router;