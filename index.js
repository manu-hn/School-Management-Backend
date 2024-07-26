const express = require('express');
require('./src/connection/DataBaseConnection.js');
const cors = require('cors');
require('dotenv').config();
const AdminRoutes = require('./src/routes/Admin.routes.js');
const StudentRoutes = require('./src/routes/Student.routes.js');
const TeacherRoutes = require('./src/routes/Teacher.routes.js');
const SubjectRoutes = require('./src/routes/Subject.routes.js');
const ComplaintRoutes = require('./src/routes/Complain.routes.js');
const S_ClassRoutes = require('./src/routes/Class.routes.js');
const NoticeRoutes = require('./src/routes/Notice.routes.js');

const PORT = process.env.PORT || 8080;

const app = express();


app.use(express.json({ limit: '20mb' }));
app.use(cors());

//routes
app.use('/api/admin', AdminRoutes);
app.use('/api/student', StudentRoutes);
app.use('/api/teacher', TeacherRoutes);
app.use('/api/subject', SubjectRoutes);
app.use('/api/complaint', ComplaintRoutes);
app.use('/api/s-class', S_ClassRoutes);
app.use('/api/notice', NoticeRoutes);

app.use("*", function (req, res) {
    return res.status(404).json({ message: "Page not found" });
})


app.listen(PORT, function () {
    console.log(`Server is running on PORT ${PORT}`);
})