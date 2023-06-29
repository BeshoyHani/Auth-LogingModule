import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    methods: {
        async isValidPassword(password) {
            const compare = await bcrypt.compare(password, this.password);
            return compare;
        }
    }
});

userSchema.pre(
    'save',
    async function (next) {
        const hash = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS);

        this.password = hash;
        next();
    }
);
const User = mongoose.model('user', userSchema);
export default User;