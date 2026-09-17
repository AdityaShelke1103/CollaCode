const mongoose = require('mongoose');
//mongodb+srv://adityashelke516_db_user:0zGyBwCQsL8cld3h@cluster0.sin2rtk.mongodb.net/?appName=Cluster0

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;