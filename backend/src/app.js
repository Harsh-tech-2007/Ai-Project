const express = require('express')
const authRouter = require('./routes/auth_route');
const interviewRouter = require('./routes/interview_route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser'); // add

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, // add
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // add

app.use("/api/auth", authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;