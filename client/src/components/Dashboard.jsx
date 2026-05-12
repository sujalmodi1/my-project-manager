import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';
import TaskList from './TaskList';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [inviteUsername, setInviteUsername] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(null);
    const token = localStorage.getItem('token');

    const fetchProjects = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await axios.post(`${API_URL}/api/projects`, projectData, {
                headers: { Authorization: `Bearer ${token}` } // Don't forget the token!
            });
            setProjects(res.data);
        } catch (err) {
            console.error("Error fetching projects", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
            toast.success('Project deleted');
        } catch (err) {
            toast.error("Error deleting project");
        }
    };

    const editProject = async (id) => {
        const newTitle = prompt("Enter new title:");
        const newDesc = prompt("Enter new description:");
        if (!newTitle) return;
        try {
            await axios.put(`/api/projects/${id}`,
                { title: newTitle, description: newDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProjects();
            toast.success('Project updated');
        } catch (err) {
            toast.error("Error updating project");
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/projects/invite',
                { projectId: showInviteModal, usernameToInvite: inviteUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Invite sent to ${inviteUsername}!`);
            setInviteUsername('');
            setShowInviteModal(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to invite user");
        }
    };

    return (
        <div className="space-y-10 transition-colors duration-500">
            {/* 1. Create Project Header */}
            <section>
                <CreateProject onProjectCreated={fetchProjects} />
            </section>

            {/* 2. Projects Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Your Workspace
                    </h2>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                        {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 transition-colors">
                        <p className="text-gray-400 dark:text-gray-500 font-medium text-lg italic">
                            Your workspace is quiet... create a project to get started!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="group bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-none transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg max-w-3xl">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <button
                                        onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${selectedProject === project.id
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'
                                            }`}
                                    >
                                        {selectedProject === project.id ? 'Close Workspace' : 'Open Tasks'}
                                    </button>

                                    <div className="ml-auto flex gap-2">
                                        <button
                                            onClick={() => editProject(project.id)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setShowInviteModal(project.id)}
                                            className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            Invite
                                        </button>
                                    </div>
                                </div>

                                {selectedProject === project.id && (
                                    <div className="mt-8 p-6 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800/60 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <TaskList projectId={project.id} token={token} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invite Team Member</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the username of the person you want to add to this workspace.</p>

                        <form onSubmit={handleInvite} className="space-y-4">
                            <input
                                autoFocus
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Username"
                                value={inviteUsername}
                                onChange={(e) => setInviteUsername(e.target.value)}
                                required
                            />
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(null)}
                                    className="flex-1 px-4 py-2 text-gray-500 dark:text-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;