import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        Admin Portal
                    </h1>
                    <button onClick={logout} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-red-500/30">
                        Sign Out
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-cyan-300">User Management</h2>
                        <p className="text-gray-400 mb-6">Create, edit, or disable user accounts. Assign roles.</p>
                        <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium transition">Manage Users</button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-purple-300">Course Assignment</h2>
                        <p className="text-gray-400 mb-6">Assign courses to students and trainers.</p>
                        <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition">Manage Courses</button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-pink-300">Active Sessions</h2>
                        <p className="text-gray-400 mb-6">Monitor logins and force logout suspicious sessions.</p>
                        <button className="w-full py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-medium transition">View Sessions</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
