const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const { emitTaskCreated } = require("../socket");

const taskPopulate = [
    { path: "userId", select: "_id name email" },
    { path: "assignedUserId", select: "_id name email" }
];

const resolveAssignedUserId = async (assignedUserId) => {
    if (assignedUserId === undefined) {
        return undefined;
    }

    if (assignedUserId === null || assignedUserId === "") {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(assignedUserId)) {
        throw new Error("Assigned user id is invalid.");
    }

    const assignedUser = await User.findById(assignedUserId);

    if (!assignedUser) {
        throw new Error("Assigned user not found.");
    }

    return assignedUser._id;
};

const createTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }

        const { title, description, priority, assignedUserId } = req.body;

        if (!title || !description || !priority) {
            return res.status(400).json({
                message: "Title, description and priority are required."
            });
        }

        let resolvedAssignedUserId = null;

        try {
            resolvedAssignedUserId = await resolveAssignedUserId(assignedUserId);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        let task = await Task.create({
            title,
            description,
            priority,
            userId: req.user.id,
            assignedUserId: resolvedAssignedUserId
        });

        task = await task.populate(taskPopulate);

        emitTaskCreated(task);

        return res.status(201).json({
            message: "Task created successfully.",
            data: {
                task
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while creating task."
        });
    }
};

const getTasks = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }

        const tasks = await Task.find({
            $or: [
                { userId: req.user.id },
                { assignedUserId: req.user.id }
            ]
        }).populate(taskPopulate);

        return res.status(200).json({
            message: "Tasks fetched successfully.",
            data: {
                tasks
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while fetching tasks."
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task id."
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only the owner can delete this task."
            });
        }

        await Task.findByIdAndDelete(id);

        return res.json({
            message: "Task deleted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while deleting task."
        });
    }
};

const updateTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task id."
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const isOwner = task.userId.toString() === req.user.id;
        const isAssignedUser =
            task.assignedUserId && task.assignedUserId.toString() === req.user.id;

        if (!isOwner && !isAssignedUser) {
            return res.status(403).json({
                message: "You are not allowed to update this task."
            });
        }

        if (isAssignedUser && !isOwner) {
            if (req.body.done === undefined) {
                return res.status(403).json({
                    message: "Assigned user can only update done status."
                });
            }

            task.done = req.body.done;
        } else {
            const { title, description, priority, done, assignedUserId } = req.body;

            if (title !== undefined) {
                task.title = title;
            }

            if (description !== undefined) {
                task.description = description;
            }

            if (priority !== undefined) {
                task.priority = priority;
            }

            if (done !== undefined) {
                task.done = done;
            }

            if (assignedUserId !== undefined) {
                try {
                    task.assignedUserId = await resolveAssignedUserId(assignedUserId);
                } catch (error) {
                    return res.status(400).json({
                        message: error.message
                    });
                }
            }
        }

        await task.save();
        await task.populate(taskPopulate);

        return res.json({
            message: "Task updated successfully.",
            data: {
                task
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while updating task."
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    deleteTask,
    updateTask
};