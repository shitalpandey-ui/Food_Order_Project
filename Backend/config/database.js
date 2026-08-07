const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDatabase;