<<<<<<< HEAD
require("dotenv").config();

const { connectDB } = require("./config/db");
const app = require("./app");
=======
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { connectDB } = require("./config/db");
const app = require("./app");
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 5000;
>>>>>>> teacher/main

const startServer = async () => {
    try {
        console.log("1. Starting server...");

<<<<<<< HEAD
        await connectDB();
        console.log("2. Database connected");

        app.listen(5000, () => {
            console.log("3. Server is running on port 5000");
        });

    } catch (error) {
=======
        const server = http.createServer(app);
        initializeSocket(server);

        server.listen(PORT, ()=>{
            console.log("Server is running...");
        });
    }catch(error){
>>>>>>> teacher/main
        console.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();