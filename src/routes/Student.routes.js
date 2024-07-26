const express = require('express');
const { clearAllStudentsAttendance, clearAllStudentsAttendanceBySubject,
    deleteStudent, deleteStudents, deleteStudentsByClass,
    getStudentDetail, getStudents, removeStudentAttendance,
    removeStudentAttendanceBySubject, studentAttendance,
    studentLogIn, studentRegister, updateExamResult, updateStudent, } = require('../controller/studentController.js');



const router = express.Router();



router.post('/student-registration', studentRegister);
router.post('/student-login', studentLogIn)

router.get("/get-students/:id", getStudents)
router.get("/get-student/:id", getStudentDetail)

router.delete("/delete-students/:id", deleteStudents)
router.delete("/delete-students-by-class/:id", deleteStudentsByClass)
router.delete("/delete-student/:id", deleteStudent)

router.put("/update-student/:id", updateStudent)

router.put('/update-exam-result/:id', updateExamResult)

router.put('/student-attendance/:id', studentAttendance)

router.put('/remove-all-students-attendance-by-subject/:id', clearAllStudentsAttendanceBySubject);
router.put('/remove-all-students-attendance/:id', clearAllStudentsAttendance);

router.put('/remove-students-attendance-by-subject:id', removeStudentAttendanceBySubject);
router.put('/remove-student-attendance/:id', removeStudentAttendance)

module.exports = router;