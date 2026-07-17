import dotenv from 'dotenv';
import app from "./app.js";
import connectDB from "./config/db.js";

// configure the dotenv file 
dotenv.config();

///PORT
const PORT = process.env.PORT || 5000;

const startServer =  async() => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Support API is running successfully on Port ${PORT}`);
        })
    } catch (error) {
        console.error("SupportDesk API failed to start", error.message);
        process.exit(1);
    }
}

startServer();

