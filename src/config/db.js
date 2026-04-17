const mongoose = require("mongoose");

const connectDB = async () => {
<<<<<<< HEAD
  const mongoUri = process.env.MONGO_URI;
=======
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

>>>>>>> teacher/main
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
};

module.exports = { connectDB };
