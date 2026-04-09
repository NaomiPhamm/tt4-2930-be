const Task = require("../models/Task");

const createTask = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { title, description, done, priority, assignedUserId } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newTask = await Task.create({
            title,
            description,
            done,
            priority,
            userId: req.user.id,
            assignedUserId
        });

        res.status(201).json(newTask);

    }
    catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};


const getTasks = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const tasks = await Task.find({
            $or: [
                { userId: req.user.id },
                { assignedUserId: req.user.id }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);

    }
    catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};


module.exports = {
    createTask,
    getTasks
};