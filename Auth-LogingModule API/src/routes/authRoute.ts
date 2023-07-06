import { login, isLoggedIn, registerUser, requestResetPassword, resetPasswordController } from "../Controllers/authController";
import { Router } from "express";
import validateReqParameters from "../middlewares/joiValidationMiddleware";
import catchAsync from "../utils/catchAsync";
import passport from "passport";

const authRouter = Router();

authRouter.post('/signup', registerUser);
authRouter.post('/login', validateReqParameters('userLoginSchema'), login);
authRouter.get('/login/success', isLoggedIn);

authRouter.post('/requestPasswordReset', catchAsync(requestResetPassword));
authRouter.post('/passwordReset', validateReqParameters('resetPassword'), catchAsync(resetPasswordController));

authRouter.get('/github', passport.authenticate('github', { scope: ["profile"] }));
authRouter.get('/github/callback', passport.authenticate('github', {

    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
}));

export default authRouter;