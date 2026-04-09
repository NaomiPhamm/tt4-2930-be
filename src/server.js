require("dotenv").config();

const { connectDB } = require("./config/db");
const app = require("./app");

const startServer = async () => {
    try {
        console.log("1. Starting server...");

        await connectDB();
        console.log("2. Database connected");

        app.listen(5000, () => {
            console.log("3. Server is running on port 5000");
        });

    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();