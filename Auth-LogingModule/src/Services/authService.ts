import passport from "passport";
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GithubStrategy } from 'passport-github2';
import User from "../Models/userModel";
import Logger from "../config/logger";
import Token from "../Models/tokenModel";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const { firstName, lastName } = req.body;
                let user = await User.create({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                });
                return done(null, user);
            } catch (error) {
                Logger.error(error);
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(new Error('User not found'), false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(new Error('Wrong Password'), false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                Logger.error(error);
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                Logger.error(error);
                done(error);
            }
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ githubId: profile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User({
                        email: profile.email,
                        name: profile.displayName,
                        githubId: profile.id,
                    });

                    const savedUser = await newUser.save();

                    done(null, savedUser);
                }
            } catch (error) {
                Logger.error(error)
                done(error);
            }
        }
    )
);

export const generateResetPasswordLink = async (email: string): Promise<string> => {
    try {
        const user = await User.findOne({ email });
        if (!user)
            throw new Error("User does not exist");

        const token = await Token.findOne({ userId: user._id });
        if (token)
            await token.deleteOne();

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.SALT_ROUNDS));
        await new Token({
            userId: user._id,
            token: hash,
        }).save();

        const link = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user._id}`;
        return link;

    } catch (error) {
        Logger.error(error);
        throw new Error(error.message);
    }
}

export const resetPassword = async (userId: string, token: string, password: string) => {
    try {
        let passwordResetToken = await Token.findOne({ userId });
        if (!passwordResetToken) {
            throw new Error("Invalid or expired password reset token");
        }
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }
        const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { password: hash } },
            { new: true }
        );
        await passwordResetToken.deleteOne();
        return user;

    } catch (error) {
        Logger.error(error);
        throw new Error(error.message);
    }
};