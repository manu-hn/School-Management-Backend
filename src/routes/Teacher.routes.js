const express = require('express');
const { deleteTeacher, deleteTeachers,
    deleteTeachersByClass, getTeacherDetail,
    getTeachers, teacherAttendance,
    teacherLogIn, teacherRegister,
    updateTeacherSubject } = require('../controller/teacherController.js');


const router = express.Router();


router.post('/teacher-registration', teacherRegister);
router.post('/teacher-login', teacherLogIn)

router.get("/get-teachers/:id", getTeachers)
router.get("/get-teacher/:id", getTeacherDetail)

router.delete("/delete-teachers/:id", deleteTeachers)
router.delete("/delete-teacher-by-class/:id", deleteTeachersByClass)
router.delete("/delete-teacher/:id", deleteTeacher)

router.put("/update-teacher-subject", updateTeacherSubject)

router.post('/teacher-attendance/:id', teacherAttendance)

module.exports = router;