const path = require('path');
const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb://newadmin:newadmin123@172.31.44.0:27017/admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connection Successful");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit the process on DB connection failure
    }
}
connectDB();

// Define Schema & Model
const dataSchema = new mongoose.Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
const PlanetModel = mongoose.model('planets', dataSchema);

// POST - Get Planet Data
app.post('/planet', async (req, res) => {
    try {
        const planetData = await PlanetModel.findOne({ id: req.body.id });
        if (!planetData) {
            console.error("❌ Invalid Planet ID:", req.body.id);
            return res.status(400).json({ error: "Invalid Planet ID. Choose a number from 0-9." });
        }
        res.json(planetData);
    } catch (err) {
        console.error("❌ Error Fetching Planet Data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// OS Info Route
app.get('/os', (req, res) => {
    res.json({ os: os.hostname(), env: process.env.NODE_ENV });
});

// Health Check Routes
app.get('/live', (req, res) => res.json({ status: "live" }));
app.get('/ready', (req, res) => res.json({ status: "ready" }));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
