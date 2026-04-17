import React, { createContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

// ── helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const genId = () => Math.random().toString(36).substr(2, 9).toUpperCase();
const now = () => new Date().toISOString();
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateTime = (iso) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const SEED_USERS = [
  { id:'USR001', name:'Aarav Sharma', email:'student@eduverse.com', mobile:'9876543210', password:'Student@123', role:'student', status:'active', joined: now(), lastLogin: now(), interests:['web','ai'], assignedCourses:['CRS001','CRS002'] },
  { id:'USR002', name:'Priya Mehta', email:'trainer@eduverse.com', mobile:'9123456780', password:'Trainer@123', role:'trainer', status:'active', joined: now(), lastLogin: now(), subject:'Python & Data Science', bio:'Experienced Python developer.', assignedCourses:[] },
  { id:'ADM001', name:'System Admin', email:'admin@eduverse.com', mobile:'9000000001', password:'Admin@123', role:'admin', status:'active', joined: now(), lastLogin: now(), assignedCourses:[] },
];
const SEED_COURSES = [
  { id:'CRS001', title:'Python Fundamentals', description:'Learn Python from scratch.', category:'Data Science', icon:'🐍', trainerId:'USR002', trainerName:'Priya Mehta', created: now(), videos:[
    { id:'VID001', title:'Introduction to Python', url:'https://www.youtube.com/watch?v=rfscVS0vtbw', duration:'4:26:52' },
    { id:'VID002', title:'Python Data Types', url:'https://www.youtube.com/watch?v=gfDE2a7MKjA', duration:'15:42' },
    { id:'VID003', title:'Control Flow', url:'https://www.youtube.com/watch?v=NE97ylAnrz4', duration:'22:10' },
  ]},
  { id:'CRS002', title:'React JS Masterclass', description:'Build modern web apps with React.', category:'Web Development', icon:'⚛️', trainerId:'USR002', trainerName:'Priya Mehta', created: now(), videos:[
    { id:'VID004', title:'React Basics', url:'https://www.youtube.com/watch?v=Tn6-PIqc4UM', duration:'1:07:35' },
    { id:'VID005', title:'Hooks Deep Dive', url:'https://www.youtube.com/watch?v=O6P86uwfdR0', duration:'35:20' },
  ]},
];

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [users, setUsersRaw] = useState(() => load('lms_users', SEED_USERS));
  const [courses, setCoursesRaw] = useState(() => load('lms_courses', SEED_COURSES));
  const [sessions, setSessionsRaw] = useState(() => load('lms_sessions', []));
  const [auditLog, setAuditRaw] = useState(() => load('lms_audit', []));
  const [currentUser, setCurrentUserRaw] = useState(() => load('lms_current_user', null));
  const [toast, setToast] = useState({ msg: '', type: '', show: false });

  const setUsers = useCallback((v) => { const val = typeof v === 'function' ? v(load('lms_users', SEED_USERS)) : v; save('lms_users', val); setUsersRaw(val); }, []);
  const setCourses = useCallback((v) => { const val = typeof v === 'function' ? v(load('lms_courses', SEED_COURSES)) : v; save('lms_courses', val); setCoursesRaw(val); }, []);
  const setSessions = useCallback((v) => { const val = typeof v === 'function' ? v(load('lms_sessions', [])) : v; save('lms_sessions', val); setSessionsRaw(val); }, []);
  const setAudit = useCallback((v) => { const val = typeof v === 'function' ? v(load('lms_audit', [])) : v; save('lms_audit', val); setAuditRaw(val); }, []);
  const setCurrentUser = useCallback((user) => { save('lms_current_user', user); setCurrentUserRaw(user); }, []);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }, []);

  // ── Auth ──
  const login = useCallback((identifier, password, role) => {
    const user = users.find(u => {
      const matchId = role === 'admin' ? u.id === identifier : (u.email === identifier || u.mobile === identifier);
      return matchId && u.password === password && u.role === role && u.status === 'active';
    });
    if (!user) return { ok: false, msg: 'Invalid credentials. Please try again.' };
    const session = { id: genId(), userId: user.id, name: user.name, role: user.role, ip: '192.168.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255), device: navigator.userAgent.includes('Mac') ? 'Mac / Chrome' : 'Windows / Chrome', loginTime: now() };
    setSessions(s => [session, ...s]);
    setAudit(a => [{ id: genId(), userId: user.id, name: user.name, action: 'LOGIN', timestamp: now(), ip: session.ip, details: `Role: ${role}` }, ...a]);
    setUsers(u => u.map(x => x.id === user.id ? { ...x, lastLogin: now() } : x));
    const cu = { ...user, sessionId: session.id };
    setCurrentUser(cu);
    return { ok: true, user: cu };
  }, [users, setSessions, setAudit, setUsers, setCurrentUser]);

  const logout = useCallback(() => {
    if (!currentUser) return;
    setAudit(a => [{ id: genId(), userId: currentUser.id, name: currentUser.name, action: 'LOGOUT', timestamp: now(), ip: '—', details: 'User logged out' }, ...a]);
    setSessions(s => s.filter(x => x.id !== currentUser.sessionId));
    setCurrentUser(null);
  }, [currentUser, setAudit, setSessions, setCurrentUser]);

  const registerStudent = useCallback((data) => {
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered.' };
    const newUser = { id: 'USR' + genId(), name: data.name, email: data.email, mobile: data.mobile, password: data.password, role: 'student', status: 'active', joined: now(), lastLogin: null, interests: data.interests || [], assignedCourses: [] };
    setUsers(u => [...u, newUser]);
    showToast('Account created! Please sign in.', 'success');
    return { ok: true };
  }, [users, setUsers, showToast]);

  const registerTeacher = useCallback((data) => {
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered.' };
    const newUser = { id: 'USR' + genId(), name: data.firstName + ' ' + data.lastName, email: data.email, mobile: data.phone, password: data.password, role: 'trainer', status: 'active', joined: now(), lastLogin: null, subject: data.subject, qualification: data.qualification, experience: data.experience, bio: data.bio, assignedCourses: [] };
    setUsers(u => [...u, newUser]);
    showToast('Application submitted! Await verification email.', 'success');
    return { ok: true };
  }, [users, setUsers, showToast]);

  // ── Progress ──
  const getProgress = useCallback((userId) => {
    return load('lms_progress_' + userId, {});
  }, []);

  const markVideoWatched = useCallback((userId, courseId, videoId) => {
    const prog = load('lms_progress_' + userId, {});
    if (!prog[courseId]) prog[courseId] = {};
    prog[courseId][videoId] = true;
    save('lms_progress_' + userId, prog);
  }, []);

  const getCourseProgress = useCallback((userId, courseId) => {
    const prog = load('lms_progress_' + userId, {});
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.videos.length) return 0;
    const watched = prog[courseId] ? Object.keys(prog[courseId]).length : 0;
    return Math.round((watched / course.videos.length) * 100);
  }, [courses]);

  // ── Courses ──
  const createCourse = useCallback((trainerId, trainerName, data) => {
    const course = { id: 'CRS' + genId(), trainerId, trainerName, title: data.title, description: data.description, category: data.category, icon: data.icon || '📚', created: now(), videos: [] };
    setCourses(c => [...c, course]);
    showToast('Course created!', 'success');
    return course;
  }, [setCourses, showToast]);

  const addVideo = useCallback((courseId, data) => {
    setCourses(c => c.map(course => course.id === courseId ? { ...course, videos: [...course.videos, { id: 'VID' + genId(), title: data.title, url: data.url, duration: data.duration || '—' }] } : course));
    showToast('Video added!', 'success');
  }, [setCourses, showToast]);

  const deleteVideo = useCallback((courseId, videoId) => {
    setCourses(c => c.map(course => course.id === courseId ? { ...course, videos: course.videos.filter(v => v.id !== videoId) } : course));
  }, [setCourses]);

  // ── Admin ──
  const createUser = useCallback((data) => {
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already exists.' };
    const newUser = { id: 'USR' + genId(), name: data.name, email: data.email, mobile: '', password: data.password, role: data.role, status: 'active', joined: now(), lastLogin: null, assignedCourses: [] };
    setUsers(u => [...u, newUser]);
    setAudit(a => [{ id: genId(), userId: newUser.id, name: newUser.name, action: 'CREATED', timestamp: now(), ip: '—', details: `Role: ${data.role}` }, ...a]);
    showToast('User created!', 'success');
    return { ok: true };
  }, [users, setUsers, setAudit, showToast]);

  const toggleUserStatus = useCallback((userId) => {
    let action = '';
    setUsers(u => u.map(x => { if (x.id === userId) { action = x.status === 'active' ? 'DISABLED' : 'active'; return { ...x, status: action === 'DISABLED' ? 'disabled' : 'active' }; } return x; }));
    setAudit(a => {
      const user = users.find(u => u.id === userId);
      return [{ id: genId(), userId, name: user?.name || userId, action: user?.status === 'active' ? 'DISABLED' : 'LOGIN', timestamp: now(), ip: '—', details: 'Status toggled by admin' }, ...a];
    });
  }, [setUsers, setAudit, users]);

  const forceLogout = useCallback((sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    setSessions(s => s.filter(x => x.id !== sessionId));
    if (session) setAudit(a => [{ id: genId(), userId: session.userId, name: session.name, action: 'FORCED', timestamp: now(), ip: session.ip, details: 'Force logout by admin' }, ...a]);
  }, [sessions, setSessions, setAudit]);

  const forceLogoutAll = useCallback(() => {
    const toLogout = sessions.filter(s => s.userId !== currentUser?.id);
    toLogout.forEach(session => setAudit(a => [{ id: genId(), userId: session.userId, name: session.name, action: 'FORCED', timestamp: now(), ip: session.ip, details: 'Force logout all by admin' }, ...a]));
    setSessions(s => s.filter(x => x.userId === currentUser?.id));
    showToast(`Force logged out ${toLogout.length} session(s).`, 'info');
  }, [sessions, setSessions, setAudit, currentUser, showToast]);

  const assignCourses = useCallback((userId, courseIds) => {
    setUsers(u => u.map(x => x.id === userId ? { ...x, assignedCourses: courseIds } : x));
    showToast('Courses assigned!', 'success');
  }, [setUsers, showToast]);

  const value = {
    users, courses, sessions, auditLog, currentUser,
    toast, showToast,
    login, logout, registerStudent, registerTeacher,
    getProgress, markVideoWatched, getCourseProgress,
    createCourse, addVideo, deleteVideo,
    createUser, toggleUserStatus, forceLogout, forceLogoutAll, assignCourses,
    fmtDate, fmtDateTime, getYouTubeId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
