const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = "mongodb+srv://nhipham2622k5_db_user:123456abc@cluster0.gdvpxia.mongodb.net/?appName=Cluster0/tt4-2930";

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
};

module.exports = { connectDB }