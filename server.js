const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(__dirname));

// Schemas
const studentSchema = new mongoose.Schema({
    usn: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    year: String,
    gender: String,
    age: mongoose.Schema.Types.Mixed,
    blood: String,
    phone: String,
    email: String,
    hostel: String,
    block: String,
    room: String,
    sharing: String,
    fname: String,
    fphone: String,
    mname: String,
    gname: String,
    gphone: String,
    address: String,
    password: String,
    status: { type: String, default: 'Pending Verification' },
    photo: String
}, { timestamps: true });

const wardenSchema = new mongoose.Schema({
    empid: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    hostel: String,
    block: String,
    email: String,
    phone: String,
    password: String,
    status: { type: String, default: 'Pending Approval' },
    photo: String
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
const Warden = mongoose.models.Warden || mongoose.model('Warden', wardenSchema);

// Seed default records if collection is empty
async function seedDefaultsIfEmpty() {
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
        await Student.insertMany([
            {
                usn: '1MS23CS01',
                name: 'Ananya Sharma',
                year: '2nd Year',
                gender: 'Female',
                age: 20,
                blood: 'O+',
                phone: '+91 98111 22334',
                email: 'ananya@campus.edu',
                hostel: 'Om Sai Hostel',
                block: 'Block 2',
                room: 'Room 204',
                sharing: 'Double Seater',
                fname: 'Ramesh Sharma',
                fphone: '+91 98111 99999',
                mname: 'Sunita Sharma',
                gname: 'Suresh Sharma',
                gphone: '+91 98111 88888',
                address: '124 Park Avenue, Indiranagar, Bengaluru',
                password: '123',
                status: 'Approved',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
            },
            {
                usn: '1MS23CS02',
                name: 'Priya Patel',
                year: '2nd Year',
                gender: 'Female',
                age: 20,
                blood: 'A+',
                phone: '+91 98222 33445',
                email: 'priya@campus.edu',
                hostel: 'Om Sai Hostel',
                block: 'Block 2',
                room: 'Room 204',
                sharing: 'Double Seater',
                fname: 'Kirit Patel',
                fphone: '+91 98222 77777',
                mname: 'Asha Patel',
                gname: '',
                gphone: '',
                address: '56 Race Course Road, Ahmedabad',
                password: '123',
                status: 'Approved',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            },
            {
                usn: '1BY24CS220',
                name: 'Rahul Verma',
                year: '1st Year',
                gender: 'Male',
                age: 19,
                blood: 'B+',
                phone: '+91 98333 44556',
                email: 'rahul@gmail.com',
                hostel: 'Om Sai Hostel',
                block: 'Block 1',
                room: 'Room 303',
                sharing: 'Single Seater',
                fname: 'Suresh Verma',
                fphone: '+91 85211 73550',
                mname: 'Rita Verma',
                gname: '',
                gphone: '',
                address: '88 MG Road, Mysuru',
                password: '123',
                status: 'Approved',
                photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
            }
        ]);
    }

    const wardenCount = await Warden.countDocuments();
    if (wardenCount === 0) {
        await Warden.create({
            empid: 'EMP-8802',
            name: 'Dr. K. V. Raman',
            hostel: 'Om Sai Hostel',
            block: 'Block 2',
            email: 'raman@campus.edu',
            phone: '+91 99000 11223',
            password: 'admin',
            status: 'Approved',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        });
    }
}

// Routes: Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().lean();
        res.json({ success: true, students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/register-student', async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.usn) payload.usn = String(payload.usn).trim().toUpperCase();
        payload.status = payload.status || 'Pending Verification';

        const existing = await Student.findOne({ usn: payload.usn });
        if (existing) {
            return res.status(409).json({ success: false, error: 'College USN already registered!' });
        }

        const created = await Student.create(payload);
        res.status(201).json({ success: true, student: created });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.patch('/api/students/:usn/approve', async (req, res) => {
    try {
        const usn = decodeURIComponent(req.params.usn).trim().toUpperCase();
        const updated = await Student.findOneAndUpdate(
            { usn },
            { status: 'Approved' },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, student: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Routes: Wardens
app.get('/api/wardens', async (req, res) => {
    try {
        const wardens = await Warden.find().lean();
        res.json({ success: true, wardens });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/register-warden', async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.empid) payload.empid = String(payload.empid).trim();
        payload.status = payload.status || 'Pending Approval';

        const existing = await Warden.findOne({ empid: payload.empid });
        if (existing) {
            return res.status(409).json({ success: false, error: 'Employee ID already registered!' });
        }

        const created = await Warden.create(payload);
        res.status(201).json({ success: true, warden: created });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.patch('/api/wardens/:empid/approve', async (req, res) => {
    try {
        const empid = decodeURIComponent(req.params.empid).trim();
        const updated = await Warden.findOneAndUpdate(
            { empid },
            { status: 'Approved' },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Warden not found' });
        }
        res.json({ success: true, warden: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

async function startServer() {
    if (!MONGODB_URI) {
        console.error('Missing MONGODB_URI environment variable.');
    } else {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
        await seedDefaultsIfEmpty();
    }
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Startup error:', err);
    process.exit(1);
});
