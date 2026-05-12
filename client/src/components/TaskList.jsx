import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import { toast } from 'react-hot-toast';

const TaskList = ({ projectId, token }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`/api/tasks/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks");
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/tasks', 
                { project_id: projectId, title: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewTask('');
            fetchTasks();
            setIsLoading(true);
        } catch (err) {
            toast.error("Error adding task");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, [projectId]);

return (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tasks</h4>
        </div>

        {/* Styled Task Input Area */}
        <form onSubmit={addTask} className="flex gap-2">
            <input 
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm placeholder:text-gray-400"
                value={newTask} 
                placeholder="What needs to be done?" 
                onChange={e => setNewTask(e.target.value)} 
                required 
            />
            <button 
                type="submit" 
                className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
            >
                Add
            </button>
        </form>

        <div className="space-y-1">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} token={token} onTaskUpdate={fetchTasks} />
            ))}
        </div>
    </div>
);
};

export default TaskList;