
const AdminModel = require('../models/adminSchema.model.js');
const { comparePassword, generateHashedPassword } = require('../utils/passwordHasher.js');

const adminRegister = async (req, res, next) => {
    try {

        const existingAdminByEmail = await AdminModel.findOne({ email: req.body.email });
        const existingSchool = await AdminModel.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            return res.status(400).json({ error: true, message: 'Email already exists' });
        }
        else if (existingSchool) {
            return res.status(400).json({ error: true, message: 'School name already exists' });
        }
        else {
            const hashedPassword = await generateHashedPassword(req.body.password);
            let result = await AdminModel.create({ ...req.body, password: hashedPassword, });
            const { password, ...data } = result?._doc;
            return res.status(201).json({ error: false, message: `Admin Created Successfully for School ${req?.body?.schoolName}`, data });
        }
    } catch (err) {

        next(err);
    }
};

const adminLogIn = async (req, res, next) => {
    try {
        const { email, password } = req?.body
        if (email && password) {
            const admin = await AdminModel.findOne({ email });
            if (admin) {
                const isValidPassword = await comparePassword(password, admin?.password);

                if (isValidPassword) {
                    const { password, ...data } = admin?._doc;
                    return res.status(200).json({ error: false, message: "Login Successful!", data });
                } else {
                    return res.status(403).json({ message: "Invalid password" });
                }
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        } else {
            return res.status(400).json({ message: "Email and password are required" });
        }
    } catch (error) {
        next(error)
    }
};


const getAdminDetail = async (req, res, next) => {
    try {
        const { id } = req?.params;
        let admin = await AdminModel.findById({ id });
        if (admin) {
            const { password, ...data } = admin?._doc;
            return res.status(200).json({ error: false, data });
        }
        else {
            return res.status(400).json({ error: true, message: "No admin found" });
        }
    } catch (err) {
        next(err)
    }
}

module.exports = { adminRegister, adminLogIn, getAdminDetail };
