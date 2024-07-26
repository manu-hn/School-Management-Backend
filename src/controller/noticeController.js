const NoticeModel = require('../models/noticeSchema.model.js');

const noticeCreate = async (req, res) => {
    try {
        const notice1 = await NoticeModel.create({ school: req.body.adminID, ...req.body });
        return res.status(201).json({ error: false, message: "Notice Created", data: notice1 })
    } catch (err) {
        return res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await NoticeModel.find({ school: req.params.id })
        if (notices.length > 0) {

            return res.status(200).json({ error: false, data: notices })
        } else {
            return res.status(400).json({ error: true, message: "No notices found" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await NoticeModel.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        return res.status(200).json({ error: false, data: result })
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await NoticeModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ error: false, data: result })
    } catch (error) {
       return res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.status(400).json({ error: true, message: "No notices found to delete" })
        } else {
            return res.status(200).json({ error: false, data: result })
        }
    } catch (error) {
        return res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };