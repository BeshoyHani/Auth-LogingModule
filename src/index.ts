import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import './Services/authService';
import { connect as connectToDB } from './DB/Connect';
import authRouter from './routes/authRoute';
import mongoose from 'mongoose';
import passport from 'passport';


const app = express();

// Connection to Database
//connectToDB()

app.use(cors({
    credentials: true,
}));

// don't compress responses if this request header is present
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false;
    }
}
app.use(compression({
    filter: shouldCompress
}));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);
app.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({
        message: 'You made it to the secure route',
        user: req.user
    })
})

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Server Running on http://localhost:" + PORT + "/");
    });
})