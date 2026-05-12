const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

// 1. CORS Configuration: This allows your Vercel frontend to talk to this backend
app.use(cors({
    origin: '*', // Allow all origins for now to fix the CORS error
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. Routes: This matches your frontend's api.post('/api/auth/register')
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 3. Health Check: Visit your Railway URL in a browser to see this
app.get('/', (req, res) => {
  res.send('Project Manager API is live! 🚀');
});

// 4. Global Error Handler: Logs errors to Railway so you can see them
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 5. Port & Binding: Necessary for Railway to "find" your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});