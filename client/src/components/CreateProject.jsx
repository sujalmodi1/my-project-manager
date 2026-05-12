import { toast } from 'react-hot-toast';
import { useState } from 'react';
import axios from 'axios';

const CreateProject = ({ onProjectCreated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            await axios.post('/api/projects',
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTitle('');
            setDescription('');
            onProjectCreated();
            toast.success("Project created successfully!");
        } catch (err) {
            toast.error("Error creating project");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Change bg-white to dark:bg-gray-900 and border-gray-100 to dark:border-gray-800 */
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-10 transition-colors duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Create New Project</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to start a new workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-1">Project Name</label>
                        <input
                            /* Added dark:bg-gray-800, dark:border-gray-700, and dark:text-white */
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                            value={title}
                            placeholder="e.g. Q2 Marketing Campaign"
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-1">Description</label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                            value={description}
                            placeholder="What's this project about?"
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="group relative w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="text-lg">+</span>
                                <span>Create Project</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;