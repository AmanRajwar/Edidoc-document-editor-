require('dotenv').config();
import mongoose, { Document, model, Model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const emailRegexPattern = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");


export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    documents: {
        document: Types.ObjectId,
        role: string,
        recentlyOpened?:Date | string
    }[];
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}


const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    documents: [
        {
            document: { type: Schema.Types.ObjectId, ref: 'Document' },
            role: {
                type: String,
                required: true,
                enum: ['viewer', 'editor', 'owner'],
            },
            recentlyOpened: { type: Date  }
        }
    ],
    password: {
        type: String,
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },
})

//encrypt password before saving 
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


//compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<Boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}


//sign access token 
userSchema.methods.signAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: '5m'
    })
}

//sign refresh token 
userSchema.methods.signRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: '3d'
    })
}

const User: Model<IUser> = model<IUser>('User', userSchema);
export default User;
