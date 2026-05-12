const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// 👈 LINE 12: This tells Express to use your routes
app.use('/api/auth', authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.get('/', (req, res) => {
  res.send('Project Manager API is live! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});