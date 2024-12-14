const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for timers
const timers = {};

// Helper function to calculate biaya
const calculateBiaya = (seconds, ratePerMinute) => {
    const minutes = Math.ceil(seconds / 60);
    return minutes * ratePerMinute;
};

// GET /
app.get("/", (req, res) => {
    res.send("Server is running. Use the API endpoints to interact.");
});

// POST /start-timer
app.post("/start-timer", (req, res) => {
    const { tv, memberName = "-", durationSeconds, mode } = req.body;

    if (!tv || (!durationSeconds && mode !== "count-up")) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const startTime = new Date();
    const endTime = mode === "count-down" ? new Date(startTime.getTime() + durationSeconds * 1000) : null;

    timers[tv] = {
        memberName,
        mode,
        startTime,
        endTime,
        remainingSeconds: durationSeconds || 0,
        biaya: mode === "count-down" ? calculateBiaya(durationSeconds, 7000 / 60) : 0,
    };

    return res.status(201).json({ message: "Timer started", timer: timers[tv] });
});

// GET /timers
app.get("/timers", (req, res) => {
    return res.json({ timers });
});

// POST /stop-timer
app.post("/stop-timer", (req, res) => {
    const { tv } = req.body;

    if (!timers[tv]) {
        return res.status(404).json({ error: "Timer not found" });
    }

    // Stop the timer without removing it
    timers[tv].isStopped = true;

    return res.json({ message: "Timer stopped", timer: timers[tv] });
});

// Server listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
