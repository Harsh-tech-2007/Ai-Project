const express = require('express')
const authRouter = require('./routes/auth_route');
const interviewRouter = require('./routes/interview_route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use('/api/interview', interviewRouter);

// 404 handler for undefined API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

module.exports = app;