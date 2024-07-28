const SubjectModel = require('../models/subjectSchema.model.js');
const TeacherModel = require('../models/teacherSchema.model.js');
const StudentModel = require('../models/studentScheme.model.js');

const subjectCreate = async (req, res, next) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        }));

        const existingSubjectBySubCode = await SubjectModel.findOne({
            'subjects.subCode': subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubjectBySubCode) {
            res.send({ message: 'Sorry this subcode must be unique as it already exists' });
        } else {
            const newSubjects = subjects.map((subject) => ({
                ...subject,
                sclassName: req.body.sclassName,
                school: req.body.adminID,
            }));

            const result = await SubjectModel.insertMany(newSubjects);
            res.status(200).json({ error: false, data: result });
        }
    } catch (err) {
        next(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName")
        if (subjects.length > 0) {
            res.status(200).json({ error: false, data: subjects })
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        let subjects = await SubjectModel.find({ sclassName: req.params.id })
        if (subjects.length > 0) {
            return res.status(200).json({ error: false, data: subjects })
        } else {
            return res.status(400).json({ message: "No subjects found" });
        }
    } catch (err) {
        next(err);
    }
};

const freeSubjectList = async (req, res, next) => {
    try {
        let subjects = await SubjectModel.find({ sclassName: req.params.id, teacher: { $exists: false } });
        if (subjects.length > 0) {
            return res.status(200).json({ error: false, data: subjects })
        } else {
            return res.status(400).json({ message: "No subjects found" });
        }
    } catch (err) {
        next(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await SubjectModel.findById(req.params.id);
        if (subject) {
            subject = await subject.populate("sclassName", "sclassName")
            subject = await subject.populate("teacher", "name")
            return res.status(200).json({ error: false, data: subject })
        }
        else {
            return res.status(400).json({ message: "No subject found" });
        }
    } catch (err) {
        next(err);
    }
}

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await SubjectModel.findByIdAndDelete(req.params.id);

        // Set the teachSubject field to null in teachers
        await TeacherModel.updateOne(
            { teachSubject: deletedSubject._id },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await StudentModel.updateMany(
            {},
            { $pull: { examResult: { subName: deletedSubject._id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await StudentModel.updateMany(
            {},
            { $pull: { attendance: { subName: deletedSubject._id } } }
        );

        res.status(200).json({ error: false, data: deletedSubject });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const deletedSubjects = await SubjectModel.deleteMany({ school: req.params.id });

        // Set the teachSubject field to null in teachers
        await TeacherModel.updateMany(
            { teachSubject: { $in: deletedSubjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Set examResult and attendance to null in all students
        await StudentModel.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.status(200).json({ error: false, message: "DeletedSuccessfully!", data: deletedSubjects });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const deletedSubjects = await SubjectModel.deleteMany({ sclassName: req.params.id });

        // Set the teachSubject field to null in teachers
        await Teacher.updateMany(
            { teachSubject: { $in: deletedSubjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Set examResult and attendance to null in all students
        await StudentModel.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.status(200).json({ error: false, message: "Deleted Successfully!", data: deletedSubjects });
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };