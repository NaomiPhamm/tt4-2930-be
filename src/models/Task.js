const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"]
        },
        done: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;