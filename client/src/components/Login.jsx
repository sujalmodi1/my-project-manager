import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { setToken, setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            setToken(res.data.token);
            setUser(res.data.user);
            alert("Login Successful!");
        } catch (err) {
            alert("Login Failed");
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="email" 
                    placeholder="Email" 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="password" 
                    placeholder="Password" 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;