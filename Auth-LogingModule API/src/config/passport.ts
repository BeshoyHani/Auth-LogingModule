import passport from "passport";
import { IStrategyOptions, IStrategyOptionsWithRequest, Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Strategy as GithubStrategy, _StrategyOptionsBase } from 'passport-github2';
import User from "../Models/userModel";

const localStrategyLoginOptions: IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
}

const localStrategySignupOptions: IStrategyOptionsWithRequest = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

const jwtStrategyOptions: StrategyOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const githubStrategyOptions: _StrategyOptionsBase = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}

const extractUserInfoFromGithubCredentials = (profile) => {
    const name = profile.displayName.split(' ');
    return {
        email: profile.emails[0].value,
        first_name: name[0],
        last_name: name[1]? name[1]: '',
        password: 'This is a dummy Password123'
    }   
}

passport.use(
    'signup',
    new localStrategy(
        localStrategySignupOptions,
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
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy(
        localStrategyLoginOptions,
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
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        jwtStrategyOptions,
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    new GithubStrategy(
        githubStrategyOptions,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userInfo = extractUserInfoFromGithubCredentials(profile);
                const user = await User.findOne({ email: userInfo.email });

                if (user) {
                    return done(null, user);
                } else {
                    const newUser = await User.create(userInfo);
                    done(null, newUser);
                }
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});