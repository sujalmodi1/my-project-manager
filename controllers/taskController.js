const pool = require('../db');

exports.createTask = async (req, res) => {
    const { project_id, title, description, priority, due_date } = req.body;
    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (project_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project_id, title, description, priority || 'Medium', due_date]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getTasksByProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const tasks = await pool.query(
            'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC',
            [projectId]
        );
        res.json(tasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Edit Task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4 WHERE id = $5 RETURNING *',
            [title, description, priority, status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};