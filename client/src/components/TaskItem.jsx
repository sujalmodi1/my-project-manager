import axios from 'axios';

const TaskItem = ({ task, token, onTaskUpdate }) => {
    const toggleStatus = async () => {
        const newStatus = task.status === 'Done' ? 'Todo' : 'Done';
        try {
            await axios.put(`/api/tasks/${task.id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onTaskUpdate();
        } catch (err) {
            alert("Error updating task");
        }
    };

    const deleteTask = async () => {
    try {
        await axios.delete(`/api/tasks/${task.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        onTaskUpdate(); // Refresh the task list
    } catch (err) {
        alert("Error deleting task");
    }
};

const priorityColors = {
    High: 'bg-red-100 text-red-600 border-red-200',
    Medium: 'bg-amber-100 text-amber-600 border-amber-200',
    Low: 'bg-blue-100 text-blue-600 border-blue-200'
};

return (
    <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
        <div className="flex items-center gap-3">
            <button 
                onClick={toggleStatus}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    task.status === 'Done' 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-transparent border-gray-300 group-hover:border-blue-400'
                }`}
            >
                {task.status === 'Done' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>
            <span className={`text-sm font-medium transition-all ${
                task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}>
                {task.title}
                {task.priority && (
                    <span className={`ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                )}
            </span>
        </div>
        
        <button 
            onClick={deleteTask}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);
};

export default TaskItem;