const express = require('express');
const { clearAllStudentsAttendance, clearAllStudentsAttendanceBySubject,
    deleteStudent, deleteStudents, deleteStudentsByClass,
    getStudentDetail, getStudents, removeStudentAttendance,
    removeStudentAttendanceBySubject, studentAttendance,
    studentLogIn, studentRegister, updateExamResult, updateStudent, } = require('../controller/studentController.js');



const router = express.Router();



router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id", getStudents)
router.get("/Student/:id", getStudentDetail)

router.delete("/Students/:id", deleteStudents)
router.delete("/StudentsClass/:id", deleteStudentsByClass)
router.delete("/Student/:id", deleteStudent)

router.put("/Student/:id", updateStudent)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/StudentAttendance/:id', studentAttendance)

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance)

module.exports = router;