import mongoose from "mongoose";
require('dotenv').config();

// fzB5F0vBVqrKgTLg password atlas amanrajwar = username
const dbUrl: string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error: any) {
        console.log(error);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;