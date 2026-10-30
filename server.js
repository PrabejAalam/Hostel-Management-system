const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas successfully!"))
.catch(err => console.error("MongoDB connection error:", err));

// Student Schema & Route
const studentSchema = new mongoose.Schema({
    name: String,
    usn: { type: String, unique: true },
    hostel: String,
    block: String,
    room: String,
    phone: String,
    email: String,
    password: String,
    status: { type: String, default: 'Pending' }
});
const Student = mongoose.model('Student', studentSchema);

app.post('/api/register-student', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save(); // Saves permanently to MongoDB Atlas!
        res.status(201).json({ success: true, message: "Student registered successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Warden Schema & Route
const wardenSchema = new mongoose.Schema({
    name: String,
    employeeId: { type: String, unique: true },
    hostel: String,
    block: String,
    email: String,
    phone: String,
    password: String,
    status: { type: String, default: 'Pending' }
});
const Warden = mongoose.model('Warden', wardenSchema);

app.post('/api/register-warden', async (req, res) => {
    try {
        const newWarden = new Warden(req.body);
        await newWarden.save(); // Saves permanently to MongoDB Atlas!
        res.status(201).json({ success: true, message: "Warden registered successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
