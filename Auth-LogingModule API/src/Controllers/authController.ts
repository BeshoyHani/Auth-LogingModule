import { NextFunction, Request, Response } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateResetPasswordLink, resetPassword } from "../Services/authService";
import sendEmail from "../utils/emails/sendEmail";

export const registerUser = (req: Request, res: Response) => {

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
    })(req, res)
}

export const login = (req: Request, res: Response) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            res.status(400).json({
                messge: 'Unsuccessfull Login',
                error: err.message,

            });
        } else {
            const sanitizedUser = createSanitizedUser(user);
            const token = generateUserToken(sanitizedUser);
            return res.status(200).json({
                message: 'Logged in Successfully',
                user: sanitizedUser,
                token
            });
        }
    })(req, res);
}

export const isLoggedIn = (req: Request, res: Response) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        const sanitizedUser = createSanitizedUser(req.user);
        const token = generateUserToken(sanitizedUser);
        res.status(200).json({
            message: 'user is authenticated',
            success: true,
            user: sanitizedUser,
            token: token
        })
    } else {
        res.status(200).json({
            message: 'user is not authenticated',
            success: false
        })
    }
}

export const requestResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const link = await generateResetPasswordLink(email);
    const isSent = await sendEmail(email, "Password Reset Request", {}, `<h1>link: ${link}</h1>`);
    if (!isSent)
        throw new Error('Couldn\'t send email');
    res.status(200).json({
        message: 'Reset Password Link is Sent Successfully'
    });
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token, password } = req.body;
    const user = await resetPassword(userId, token, password);
    const isSent = await sendEmail(user.email, "Password Reset Request", {}, ` <p>Your password has been changed successfully</p>`);
    if (!isSent)
        throw new Error('Couldn\'t send email');
    res.status(200).json({
        message: 'Password was reset Successfully'
    });
}

const createSanitizedUser = (data) => {
    const { _id, email, first_name, last_name } = data;
    return {
        id: _id,
        email,
        first_name,
        last_name
    };
}

const generateUserToken = (data) => {
    return jwt.sign({ user: data }, process.env.JWT_SECRET, { expiresIn: '3h' });
}