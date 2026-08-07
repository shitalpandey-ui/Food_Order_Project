// entry point of backend application that is used to  load the configuration, connect to the database, and start the Express server.

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDatabase();

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});