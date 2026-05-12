import { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitch }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert("Registration successful! You can now log in.");
            onSwitch(); // Take the user back to the login screen
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="Username" 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    className="w-full p-2 border rounded"
                    type="email" 
                    placeholder="Email" 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    className="w-full p-2 border rounded"
                    type="password" 
                    placeholder="Password" 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Already have an account? 
                <button onClick={onSwitch} className="text-blue-600 ml-1 underline">Login here</button>
            </p>
        </div>
    );
};

export default Register;