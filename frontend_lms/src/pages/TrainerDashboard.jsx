import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Trainer Portal
                    </h1>
                    <button onClick={logout} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-red-500/30">
                        Sign Out
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-emerald-300">My Courses</h2>
                        <p className="text-gray-400 mb-6">Create courses and update course details.</p>
                        <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition">Manage Courses</button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-cyan-300">Video Resources</h2>
                        <p className="text-gray-400 mb-6">Add, remove, or reorder YouTube video links for courses.</p>
                        <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium transition">Manage Videos</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;
