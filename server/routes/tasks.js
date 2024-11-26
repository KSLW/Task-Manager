const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a new task
router.post('/', auth, async (req, res) => {
    const { title, description, priority, category, deadline } = req.body;
    try {
        const newTask = new Task({ title, description, priority, category, deadline, user: req.user });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
    const { title, description, priority, category, deadline } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user) return res.status(401).json({ msg: 'Not authorized' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.category = category || task.category;
        task.deadline = deadline || task.deadline;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user) return res.status(401).json({ msg: 'Not authorized' });

        await task.remove();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
