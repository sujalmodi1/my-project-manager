const pool = require('../db');

// 1. Create Project (and auto-assign Admin role)
exports.createProject = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    try {
        // Start a transaction to ensure both inserts succeed
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Insert the project
            const newProject = await client.query(
                'INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
                [title, description, userId]
            );
            const projectId = newProject.rows[0].id;

            // RBAC: Automatically make creator the Admin in project_members
            await client.query(
                'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
                [projectId, userId, 'Admin']
            );

            await client.query('COMMIT');
            res.status(201).json(newProject.rows[0]);
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 2. Get Projects (Fetch all projects where user is a Member or Admin)
exports.getProjects = async (req, res) => {
    try {
        const projects = await pool.query(
            `SELECT p.*, pm.role as user_role 
             FROM projects p 
             JOIN project_members pm ON p.id = pm.project_id 
             WHERE pm.user_id = $1 
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json(projects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 3. Invite Member (The RBAC/Team logic)
exports.inviteMember = async (req, res) => {
    const { projectId, usernameToInvite, role } = req.body;
    const senderId = req.user.id;

    try {
        // Check if the sender is an Admin of this specific project
        const senderCheck = await pool.query(
            "SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2",
            [projectId, senderId]
        );

        if (senderCheck.rows.length === 0 || senderCheck.rows[0].role !== 'Admin') {
            return res.status(403).json({ message: "Only project Admins can invite members" });
        }

        // Find the user to invite
        const userFound = await pool.query("SELECT id FROM users WHERE username = $1", [usernameToInvite]);
        if (userFound.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const invitedId = userFound.rows[0].id;

        // Add to project_members
        await pool.query(
            "INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            [projectId, invitedId, role || 'Member']
        );

        res.json({ message: "Member invited successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 4. Update Project (Restricted to Admins)
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            `UPDATE projects SET title = $1, description = $2 
             WHERE id = $3 AND id IN (SELECT project_id FROM project_members WHERE user_id = $4 AND role = 'Admin') 
             RETURNING *`,
            [title, description, id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(403).json({ message: "Unauthorized: Admins only" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 5. Delete Project (Restricted to Admins)
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM projects 
             WHERE id = $1 AND id IN (SELECT project_id FROM project_members WHERE user_id = $2 AND role = 'Admin') 
             RETURNING *`,
            [id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(403).json({ message: "Unauthorized: Admins only" });
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};