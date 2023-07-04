import { login, registerUser, requestResetPassword, resetPasswordController } from "../Controllers/authController";
import { Router } from "express";
import validateReqParameters from "../middlewares/joiValidationMiddleware";
import catchAsync from "../utils/catchAsync";

const authRouter = Router();

authRouter.post('/signup', registerUser);
authRouter.post('/login', validateReqParameters('userLoginSchema'), login);
authRouter.post('/requestPasswordReset', catchAsync(requestResetPassword));
authRouter.post('/passwordReset', validateReqParameters('resetPassword'), catchAsync(resetPasswordController));

export default authRouter;