const ComplainModel = require('../models/complainSchema.model');

const complainCreate = async (req, res) => {
    try {
        const complain = new ComplainModel(req.body)
        const result = await complain.save()
        res.status(200).json({ error: false, data: result })
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await ComplainModel.find({ school: req.params.id }).populate("user", "name");
        if (complains.length > 0) {

            return res.status(200).json({ error: false, data: complains })
        } else {
            return res.send({ message: "No complains found" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
