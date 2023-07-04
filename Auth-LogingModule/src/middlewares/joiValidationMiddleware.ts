import Logger from '../config/logger';
import * as validators from '../Models/joiSchema';

export default function validateReqParameters(validator) {
    return (req, res, next) => {
        const { error } = validators[validator].validate(req.body);
        if (error === undefined) {
            next();
        }
        else {
            Logger.error(error);
            return next(error);
        }
    }
}