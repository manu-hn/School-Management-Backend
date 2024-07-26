const StudentModel = require('../models/studentScheme.model.js');
const { generateHashedPassword } = require('../utils/passwordHasher.js');

const studentRegister = async (req, res, next) => {
    try {

        const hashedPassword = await generateHashedPassword(req?.body?.password);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            return res.status(400).json({ error: true, message: 'Roll Number already exists' });
        }
        else {

            const newStudent = await StudentModel.create({
                ...req.body, school: req.body.adminID,
                password: hashedPassword
            })

            const { password, ...data } = newStudent?._doc;
            return res.status(400).json({ error: false, message: `Student Data Created Successfully`, data });
        }
    } catch (err) {
        next(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await StudentModel.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const isValidPassword = await generateHashedPassword(req.body.password, student.password);

            if (isValidPassword) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")

                const { password, examResult, attendance, ...data } = student;
                return res.status(200).json({ error: false, message: "Login Successful!", data });
            } else {
                return res.status(400).json({ error: true, message: "Invalid password" });
            }
        } else {
            return res.status(404).json({ error: true, message: "Student not found" });
        }
    } catch (err) {
        next(err);
    }
};

const getStudents = async (req, res) => {
    try {

        let students = await StudentModel.find({ school: req.params.id }).populate("sclassName", "sclassName");

        if (students.length > 0) {

            let modifiedStudents = students.map((student) => {
                const { password, ...studentData } = student._doc;
                return studentData;
            });

            return res.status(200).json({ error: false, message: "Students Data Retrieved Successfully", data: modifiedStudents });
        } else {

            return res.status(404).send({ error: true, message: "No students found" });
        }
    } catch (err) {

        return res.status(500).json({ error: true, message: "Server Error", details: err });
    }
};


const getStudentDetail = async (req, res, next) => {
    try {
        let student = await StudentModel.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            const { password, ...data } = student?._doc;
            return res.status(200).json({ error: false, data });
        }
        else {
            return res.status(404).json({ error: true, message: "No student found" });
        }
    } catch (err) {
        next(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await StudentModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ error: false, message: "Data Deleted", result })
    } catch (error) {
        res.status(500).json(err);
    }
}


const deleteStudents = async (req, res) => {
    try {
        const result = await StudentModel.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            return res.status(400).json({ error: true, message: "No students found to delete" });
        } else {
            return res.status(200).json({ error: false, message: "Deleted Successfully!", result });
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            return res.status(400).json({ error: true, message: "No students found to delete" })
        } else {
            return res.status(200).json({ error: false, message: "Deleted Successfully!", result });
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res, next) => {
    try {

        if (req.body?.password) {
            res.body.password = await generateHashedPassword(req.body?.password)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        const { password, ...data } = result?._doc;
        return res.status(200).json({ error: false, message: " Data Updated Successfully !", data })
    } catch (error) {
        next(err)
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await StudentModel.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: true, message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.status(200).json({ error: false, message: " Exams Results Updated ", data: result });
    } catch (error) {
        res.status(500).json(error);
    }
};


const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await StudentModel.findById(req.params.id);

        if (!student) {
            return res.status(400).json({ error: true, message: 'Student not found' });
        }

        const subject = await SubjectModel.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await StudentModel.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
       return res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await StudentModel.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await StudentModel.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};