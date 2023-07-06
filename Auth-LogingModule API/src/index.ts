import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import './Services/authService';
import { connect as connectToDB } from './DB/Connect';
import './config/passport';
import mongoose from 'mongoose';
import passport, { Passport } from 'passport';
import morganMiddleware from './middlewares/morganMiddleware';
import globalErrorHandler from './Controllers/errorController';
import authRouter from './routes/authRoute';
import session from 'express-session';


const app = express();

// Connection to Database
//connectToDB()

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
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

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla'
}))
app.use(passport.session())
app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);
// app.get('/auth/github', passport.authenticate('github'), (req, res, next) => {

// })
app.use('/auth', authRouter);
app.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({
        message: 'You made it to the secure route',
        user: req.user
    })
});

app.use(globalErrorHandler);

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Server Running on http://localhost:" + PORT + "/");
    });
})

//https://blog.openreplay.com/react-social-logins-with-passport-js/
//https://github.com/ChisomUma/Login-Auth-App-with-Passport.js/blob/main/Client/src/pages/Login.js
//https://ideone.com/Fbrcsk