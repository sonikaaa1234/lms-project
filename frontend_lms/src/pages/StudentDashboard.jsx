import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import VideoPlayer from '../components/VideoPlayer';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const resp = await api.get('/courses/');
                setCourses(resp.data);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            }
        };
        fetchCourses();
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <nav className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-50 shadow-xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        Student Portal
                    </h1>
                    <button 
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-red-500/30"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold mb-2 text-white">Your Assigned Courses</h2>
                    <p className="text-gray-400">Continue learning and tracking your progress.</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm">
                        <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-xl font-medium text-gray-300">No courses assigned yet.</h3>
                        <p className="text-gray-500 mt-2">Check back later or contact your administrator.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div 
                                key={course.id} 
                                onClick={() => setSelectedCourse(course)}
                                className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-cyan-500/20"
                            >
                                <div className="h-40 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <h3 className="text-2xl font-bold text-white z-10 px-4 text-center drop-shadow-md">
                                        {course.title}
                                    </h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-gray-400 text-sm line-clamp-2">{course.description || "No description provided."}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{course.videos?.length || 0} Videos</span>
                                        <span className="text-cyan-400 text-sm font-medium group-hover:underline">Start Learning</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Course Viewer Modal/Overlay */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col md:flex-row">
                    <div className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0 inline-flex">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                                <p className="text-gray-400 text-sm mt-1">{selectedCourse.description}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedCourse(null)}
                                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-8 custom-scrollbar">
                            {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
                                selectedCourse.videos.map(video => (
                                    <div key={video.id} className="space-y-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                                        <h4 className="text-xl font-medium text-purple-300">{video.title}</h4>
                                        <VideoPlayer url={video.youtube_link} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No videos available for this course.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
