const S_ClassModel = require('../models/classSchema.model.js');
const StudentModel = require('../models/studentScheme.model.js');
const SubjectModel = require('../models/subjectSchema.model.js');
const TeacherModel = require('../models/teacherSchema.model.js');

const sclassCreate = async (req, res) => {
    try {
        const sclass = new S_ClassModel({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        const existingSclassByName = await S_ClassModel.findOne({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        if (existingSclassByName) {
            return res.status(400).json({ error: false, message: 'Sorry this class name already exists' });
        }
        else {
            const result = await sclass.save();
            return res.send(result);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const sclassList = async (req, res) => {
    try {
        let sclasses = await S_ClassModel.find({ school: req.params.id })
        if (sclasses.length > 0) {
            return res.status(200).json({ error: false, data: sclasses })
        } else {
            return res.status(400).json({ error: true, message: "No S-Classes found" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getSclassDetail = async (req, res) => {
    try {
        let sclass = await S_ClassModel.findById(req.params.id);
        if (sclass) {
            sclass = await sclass.populate("school", "schoolName")
            return res.status(200).json({ error: false, data: sclass });
        }
        else {
            return res.send({ message: "No class found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSclassStudents = async (req, res) => {
    try {
        let students = await StudentModel.find({ sclassName: req.params.id })
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.status(200).json({ error: false, data: modifiedStudents });
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await S_ClassModel.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.send({ message: "Class not found" });
        }
        const deletedStudents = await Student.deleteMany({ sclassName: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ teachSclass: req.params.id });
        res.send(deletedClass);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await S_ClassModel.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.send({ message: "No classes found to delete" });
        }
        const deletedStudents = await Student.deleteMany({ school: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
        res.send(deletedClasses);
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };