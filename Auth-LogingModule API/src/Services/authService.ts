import User from "../Models/userModel";
import Logger from "../config/logger";
import Token from "../Models/tokenModel";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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