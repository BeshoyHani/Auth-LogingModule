import User from "Models/userModel";

export const createUser = async ({email, first_name, last_name, password}) => {
    await User.create({email, first_name, last_name, password});
}