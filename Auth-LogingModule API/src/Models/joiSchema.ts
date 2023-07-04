import Joi from "joi";

const minNameLength = 3;
const maxNsmeLength = 15;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$/;
const passwordErrorMsg = 'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

export const userSignupSchema = Joi.object({
    firstName: Joi.string()
        .min(minNameLength).max(maxNsmeLength)
        .required().label('First Name'),

    lastName: Joi.string().min(minNameLength).max(maxNsmeLength)
        .required().label('First Name'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'eg'] } })
        .required()
        .label('Email'),

    password: Joi.string()
        .regex(passwordRegex)
        .required()
        .label('Password')
        .error(new Error(passwordErrorMsg))
});

export const userLoginSchema = Joi.object({
    email: userSignupSchema.extract('email'),
    password: Joi.string().required()
});

export const resetPassword = Joi.object({
    password: userSignupSchema.extract('password')
}).unknown(true);

