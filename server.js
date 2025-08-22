import express, { json, urlencoded } from "express";
const app = express();
const PORT = 4000;
import cors from "cors";
import cookieParser from "cookie-parser";
import dashboard from "./routes/dashboard.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
dotenv.config();


// const authRoutes = require("./routes/auth")

// const passport = require('passport');

// const passportConfig = require('./passport'); // sets up passport strategies
// passportConfig(passport);



app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5500", "http://localhost:5174"],
    // origin: "*",
    credentials: true, // Allow cookies to be sent with requests
}))

app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
// app.use(session({
//     name: 'sid',
//     secret: process.env.SESSION_SECRET || 'dev_session_secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 10 * 24 * 60 * 60 * 1000
//     }
// }))

// app.use(passport.initialize());
// app.use(passport.session());

app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/dashboard", dashboard);

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})