const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas successfully!"))
    .catch((err) => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
    name: String,
    usn: { type: String, unique: true, trim: true, uppercase: true },
    year: String,
    gender: String,
    age: Number,
    blood: String,
    hostel: String,
    block: String,
    room: String,
    sharing: String,
    phone: String,
    email: String,
    fname: String,
    fphone: String,
    mname: String,
    gname: String,
    gphone: String,
    address: String,
    password: String,
    photo: String,
    status: { type: String, default: 'Pending Verification' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

const wardenSchema = new mongoose.Schema({
    name: String,
    empid: { type: String, unique: true, trim: true, uppercase: true },
    hostel: String,
    block: String,
    email: String,
    phone: String,
    password: String,
    photo: String,
    status: { type: String, default: 'Pending Approval' }
}, { timestamps: true });

const Warden = mongoose.model('Warden', wardenSchema);

// Student Registration
app.post('/api/register-student', async (req, res) => {
    try {
        const payload = {
            ...req.body,
            usn: String(req.body.usn || '').trim().toUpperCase(),
            status: 'Pending Verification'
        };
        const newStudent = new Student(payload);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Student registered successfully!", student: newStudent });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, error: "A student with this USN already exists." });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get All Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({ success: true, count: students.length, students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Approve Student
app.patch('/api/students/:usn/approve', async (req, res) => {
    try {
        const usn = String(req.params.usn).trim().toUpperCase();
        const student = await Student.findOneAndUpdate(
            { usn },
            { status: 'Approved' },
            { new: true }
        );
        if (!student) return res.status(404).json({ success: false, error: "Student not found." });
        res.json({ success: true, student });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Warden Registration
app.post('/api/register-warden', async (req, res) => {
    try {
        const empid = String(req.body.empid || req.body.employeeId || '').trim().toUpperCase();
        const payload = {
            ...req.body,
            empid,
            status: 'Pending Approval'
        };
        const newWarden = new Warden(payload);
        await newWarden.save();
        res.status(201).json({ success: true, message: "Warden registered successfully!", warden: newWarden });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, error: "A warden with this Employee ID already exists." });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get All Wardens
app.get('/api/wardens', async (req, res) => {
    try {
        const wardens = await Warden.find().sort({ createdAt: -1 });
        res.json({ success: true, count: wardens.length, wardens });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Approve Warden
app.patch('/api/wardens/:empid/approve', async (req, res) => {
    try {
        const empid = String(req.params.empid).trim().toUpperCase();
        const warden = await Warden.findOneAndUpdate(
            { empid },
            { status: 'Approved' },
            { new: true }
        );
        if (!warden) return res.status(404).json({ success: false, error: "Warden not found." });
        res.json({ success: true, warden });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
