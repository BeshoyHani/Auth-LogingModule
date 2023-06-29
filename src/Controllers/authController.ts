import { NextFunction, Request, Response } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';

export const registerUser = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('signup', { session: false }, (err, user) => {
        if (err) {
            res.status(500).json({
                message: 'Oops! Something Went Wrong',
                error: err.message
            });
        } else {
            res.status(200).json({
                message: 'Signed Up Successfully',
                user: user,
            })
        }
    })(req, res, next)
}

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            res.status(400).json({
                messge: 'Unsuccessfull Login',
                error: err.message,

            });
        } else {

            const { _id, email, first_name, last_name } = user;
            const body = {
                id: _id,
                email,
                first_name,
                last_name
            };
            const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '3h' });
            return res.status(200).json({
                message: 'Logged in Successfully',
                user: body,
                token
            });
        }
    })(req, res, next);
}