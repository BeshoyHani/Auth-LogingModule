import { login, registerUser } from "../Controllers/authController";
import { Router } from "express";
import passport  from 'passport';

const authRouter = Router();

authRouter.post('/signup', registerUser);
authRouter.post('/login', login);

export default authRouter;