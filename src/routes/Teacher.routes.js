const express = require('express');
const { deleteTeacher, deleteTeachers,
    deleteTeachersByClass, getTeacherDetail,
    getTeachers, teacherAttendance,
    teacherLogIn, teacherRegister,
    updateTeacherSubject } = require('../controller/teacherController.js');


const router = express.Router();


router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn)

router.get("/Teachers/:id", getTeachers)
router.get("/Teacher/:id", getTeacherDetail)

router.delete("/Teachers/:id", deleteTeachers)
router.delete("/TeachersClass/:id", deleteTeachersByClass)
router.delete("/Teacher/:id", deleteTeacher)

router.put("/TeacherSubject", updateTeacherSubject)

router.post('/TeacherAttendance/:id', teacherAttendance)

module.exports = router;