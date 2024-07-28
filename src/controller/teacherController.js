const bcrypt = require('bcryptjs');
const TeacherModel = require('../models/teacherSchema.model.js');
const SubjectModel = require('../models/subjectSchema.model.js');
const { generateHashedPassword } = require('../utils/passwordHasher.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {

        const hashedPass = await generateHashedPassword(password);

        const existingTeacherByEmail = await TeacherModel.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
           
            const result = await TeacherModel.create({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });
            await SubjectModel.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
            const { password, ...data } = result?._doc;
            return res.status(201)({ error: false, message: "Registration Successful", data });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await TeacherModel.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")

                const { password, ...data } = teacher?._doc;

                return res.status(201)({ error: false, message: "Registration Successful", data });
            } else {
                return res.status(404).json({ error: true, message: "Invalid password" });
            }
        } else {
            return res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await TeacherModel.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {

            let modifiedTeachers = teachers.map((teacher) => {

                const { password, ...teacherData } = teacher._doc;
                return teacherData;
            });
            return res.status(200).json({ error: false, message: "Successfully Fetched!", data: modifiedTeachers });
        } else {
            return res.status(400).json({ error: true, message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await TeacherModel.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            const { password, ...data } = teacher?._doc;

            return res.status(200).json({ error: false, data });
        }
        else {
            return res.status(400).json({ error: true, message: "No teacher found" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teacherSubject } = req.body;
    try {
        const updatedTeacher = await TeacherModel.findByIdAndUpdate(
            teacherId,
            { teacherSubject },
            { new: true }
        );

        await SubjectModel.findByIdAndUpdate(teacherSubject, { teacher: updatedTeacher._id });

        res.status(200).json({ error: false, message: "Updated Successfully!", data: updatedTeacher });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await TeacherModel.findByIdAndDelete(req.params.id);

        await SubjectModel.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        return res.status(200).json({ error: false, message: "Updated Successfully!", data: deletedTeacher });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await TeacherModel.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            return res.status(400).json({ error: true, message: "No teachers found to delete" });
        }

        const deletedTeachers = await TeacherModel.find({ school: req.params.id });

        await SubjectModel.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        return res.status(200).json({ error: false, message: "Updated Successfully!", data: deletedTeachers });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await TeacherModel.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            return res.status(404).json({ error: true, message: "No teachers found to delete" });
        }

        const deletedTeachers = await TeacherModel.find({ sclassName: req.params.id });

        await SubjectModel.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.status(200).json({ error: false, message: "Updated Successfully!", data: deletionResult });
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await TeacherModel.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.status(200).json({ error: false, message: "Updated Successfully!", data: result });
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};