import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Sidebar from '../components/dashboard/Sidebar';
import DashHeader from '../components/dashboard/DashHeader';

const NAV = [
  { label: 'Administration', items: [
    { section: 'overview', title: 'Dashboard', iconPath: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
    { section: 'users', title: 'User Management', iconPath: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>' },
    { section: 'courses', title: 'Courses', iconPath: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>' },
    { section: 'sessions', title: 'Session Monitor', iconPath: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
    { section: 'audit', title: 'Audit Log', iconPath: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  ]},
  { label: 'System', items: [
    { section: 'settings', title: 'Settings', iconPath: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>' },
  ]},
];

export default function AdminDashboard() {
  const { currentUser, users, courses, sessions, auditLog, logout, createUser, toggleUserStatus, forceLogout, forceLogoutAll, assignCourses, showToast } = useApp();
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('');
  // add user modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [nuName, setNuName] = useState(''); const [nuEmail, setNuEmail] = useState('');
  const [nuRole, setNuRole] = useState('student'); const [nuPw, setNuPw] = useState('');
  // assign course modal
  const [assignUser, setAssignUser] = useState(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const handleNav = (s) => {
    if (s === '__logout__') { logout(); navigate('/'); return; }
    setSection(s);
  };

  const handleCreateUser = () => {
    if (!nuName || !nuEmail || !nuPw) return showToast('Please fill all fields.', 'error');
    const res = createUser({ name: nuName, email: nuEmail, role: nuRole, password: nuPw });
    if (res.ok) { setNuName(''); setNuEmail(''); setNuRole('student'); setNuPw(''); setShowAddUser(false); }
    else showToast(res.msg, 'error');
  };

  const openAssign = (user) => {
    setAssignUser(user);
    setSelectedCourseIds(user.assignedCourses || []);
  };

  const handleAssign = () => {
    assignCourses(assignUser.id, selectedCourseIds);
    setAssignUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole && u.role !== 'admin';
  }).filter(u => u.id !== currentUser?.id || u.role === 'admin');

  const filteredCourses = courses.filter(c => !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase()));
  const filteredAudit = auditLog.filter(e => !auditFilter || e.action === auditFilter);

  const AuditBadge = ({ action }) => <span className={`audit-action audit-${action}`}>{action}</span>;

  return (
    <div className="dash-layout">
      <Sidebar navItems={NAV} role="admin" activeSection={section} onNav={handleNav} />
      <div className="main-content">
        <DashHeader title="Admin Dashboard" role="admin">
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', color:'var(--success)', background:'rgba(16,185,129,0.1)', padding:'6px 12px', borderRadius:20, border:'1px solid rgba(16,185,129,0.2)' }}>
            <span className="pulse-dot" /> System Online
          </div>
        </DashHeader>
        <div className="content-area">

          {/* OVERVIEW */}
          {section === 'overview' && (
            <div className="content-section active">
              <div className="page-title">System Overview</div>
              <div className="page-subtitle">Real-time platform statistics and health monitoring.</div>
              <div className="stats-row">
                {[
                  { label:'Total Users', value: users.length, gradient:'linear-gradient(90deg,#EF4444,#F59E0B)' },
                  { label:'Active Sessions', value: sessions.length, gradient:'linear-gradient(90deg,#10B981,#06B6D4)' },
                  { label:'Total Courses', value: courses.length, gradient:'linear-gradient(90deg,#3B82F6,#8B5CF6)' },
                  { label:'Enrollments', value: users.reduce((s, u) => s + (u.assignedCourses?.length || 0), 0), gradient:'linear-gradient(90deg,#8B5CF6,#EC4899)' },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{'--card-gradient': s.gradient}}>
                    <div className="stat-header"><span className="stat-label">{s.label}</span></div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="section-header">
                <span className="section-title">Active Sessions</span>
                <button className="section-action" onClick={() => setSection('sessions')}>View All →</button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>User</th><th>Role</th><th>IP Address</th><th>Device</th><th>Since</th><th>Action</th></tr></thead>
                  <tbody>
                    {sessions.slice(0,5).map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td><span className={`badge badge-${s.role}`}>{s.role}</span></td>
                        <td style={{ fontFamily:'monospace', fontSize:'0.82rem' }}>{s.ip}</td>
                        <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{s.device?.split('/')[0]}</td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(s.loginTime).toLocaleTimeString()}</td>
                        <td><button className="btn-sm btn-sm-danger" onClick={() => forceLogout(s.id)}>Force Out</button></td>
                      </tr>
                    ))}
                    {sessions.length === 0 && <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-muted)' }}>No active sessions</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="section-header">
                <span className="section-title">Recent Audit Events</span>
                <button className="section-action" onClick={() => setSection('audit')}>View Log →</button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>User</th><th>Action</th><th>Timestamp</th><th>IP</th></tr></thead>
                  <tbody>
                    {auditLog.slice(0,8).map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td><AuditBadge action={e.action} /></td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(e.timestamp).toLocaleString()}</td>
                        <td style={{ fontFamily:'monospace', fontSize:'0.78rem' }}>{e.ip}</td>
                      </tr>
                    ))}
                    {auditLog.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text-muted)' }}>No audit events yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {section === 'users' && (
            <div className="content-section active">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div><div className="page-title">User Management</div><div className="page-subtitle">Create, edit, and manage platform users.</div></div>
                <button className="btn-sm btn-sm-primary" style={{ padding:'10px 20px' }} onClick={() => setShowAddUser(true)}>+ Add User</button>
              </div>
              <div className="table-wrapper">
                <div className="table-header">
                  <span className="table-title">All Users ({filteredUsers.length})</span>
                  <div className="table-actions">
                    <div className="search-box">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" placeholder="Search users…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    </div>
                    <select className="role-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                      <option value="">All Roles</option>
                      <option value="student">Students</option>
                      <option value="trainer">Trainers</option>
                    </select>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Courses</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.name}</strong><br/>
                          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{u.email}</span>
                        </td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td><span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-disabled'}`}>{u.status}</span></td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(u.joined).toLocaleDateString()}</td>
                        <td>{(u.assignedCourses || []).length}</td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn-sm btn-sm-primary" onClick={() => openAssign(u)}>Assign</button>
                            <button className={`btn-sm ${u.status === 'active' ? 'btn-sm-danger' : 'btn-sm-success'}`} onClick={() => toggleUserStatus(u.id)}>
                              {u.status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-muted)' }}>No users found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COURSES */}
          {section === 'courses' && (
            <div className="content-section active">
              <div className="page-title">Course Oversight</div>
              <div className="page-subtitle">Platform-wide course management.</div>
              <div className="table-wrapper">
                <div className="table-header">
                  <span className="table-title">All Courses</span>
                  <div className="search-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" placeholder="Search courses…" value={courseSearch} onChange={e => setCourseSearch(e.target.value)} />
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Course</th><th>Trainer</th><th>Category</th><th>Videos</th><th>Students</th><th>Created</th></tr></thead>
                  <tbody>
                    {filteredCourses.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.icon} {c.title}</strong></td>
                        <td>{c.trainerName}</td>
                        <td><span className="badge badge-student">{c.category}</span></td>
                        <td>{c.videos.length}</td>
                        <td>{users.filter(u => (u.assignedCourses || []).includes(c.id)).length}</td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(c.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {filteredCourses.length === 0 && <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-muted)' }}>No courses found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SESSIONS */}
          {section === 'sessions' && (
            <div className="content-section active">
              <div className="page-title">Session Monitor</div>
              <div className="page-subtitle">Track and manage active user sessions.</div>
              <div className="table-wrapper">
                <div className="table-header">
                  <span className="table-title"><span className="pulse-dot" style={{ marginRight:6 }} />{sessions.length} Active</span>
                  <button className="btn-sm btn-sm-danger" onClick={forceLogoutAll}>Force Logout All</button>
                </div>
                <table className="data-table">
                  <thead><tr><th>User</th><th>Role</th><th>IP Address</th><th>Device</th><th>Login Time</th><th>Action</th></tr></thead>
                  <tbody>
                    {sessions.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td><span className={`badge badge-${s.role}`}>{s.role}</span></td>
                        <td style={{ fontFamily:'monospace', fontSize:'0.82rem' }}>{s.ip}</td>
                        <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{s.device?.split('/')[0]}</td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(s.loginTime).toLocaleString()}</td>
                        <td><button className="btn-sm btn-sm-danger" onClick={() => forceLogout(s.id)}>Force Out</button></td>
                      </tr>
                    ))}
                    {sessions.length === 0 && <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-muted)' }}>No active sessions</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDIT */}
          {section === 'audit' && (
            <div className="content-section active">
              <div className="page-title">Audit Log</div>
              <div className="page-subtitle">Complete history of user actions and system events.</div>
              <div className="table-wrapper">
                <div className="table-header">
                  <span className="table-title">Event Log ({filteredAudit.length})</span>
                  <select className="role-select" value={auditFilter} onChange={e => setAuditFilter(e.target.value)}>
                    <option value="">All Events</option>
                    <option value="LOGIN">Login</option><option value="LOGOUT">Logout</option>
                    <option value="DISABLED">Disabled</option><option value="FORCED">Force Logout</option><option value="CREATED">Created</option>
                  </select>
                </div>
                <table className="data-table">
                  <thead><tr><th>User</th><th>Action</th><th>Timestamp</th><th>IP</th><th>Details</th></tr></thead>
                  <tbody>
                    {filteredAudit.map(e => (
                      <tr key={e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td><AuditBadge action={e.action} /></td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{new Date(e.timestamp).toLocaleString()}</td>
                        <td style={{ fontFamily:'monospace', fontSize:'0.78rem' }}>{e.ip}</td>
                        <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{e.details}</td>
                      </tr>
                    ))}
                    {filteredAudit.length === 0 && <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-muted)' }}>No events found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div className="content-section active">
              <div className="page-title">System Settings</div>
              <div className="page-subtitle">Platform configuration and admin profile.</div>
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>🔐 Admin Profile</h3>
                  <div className="form-group"><label>Name</label><input className="form-control" defaultValue={currentUser?.name} /></div>
                  <div className="form-group"><label>Email</label><input className="form-control" defaultValue={currentUser?.email} type="email" /></div>
                  <button className="btn-sm btn-sm-success" style={{ marginTop:8 }} onClick={() => showToast('Profile saved!', 'success')}>Save Profile</button>
                </div>
                <div className="settings-card">
                  <h3>⚙️ Platform Settings</h3>
                  {[['Right-click protection','Enabled'],['Dynamic watermark','Enabled'],['Single device session','Enabled'],['HTTPS enforcement','Enabled']].map(([k,v]) => (
                    <div key={k} className="form-group" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <label style={{ textTransform:'none', fontSize:'0.875rem', fontWeight:500 }}>{k}</label>
                      <div style={{ padding:'4px 12px', background:'rgba(16,185,129,0.1)', color:'var(--success)', borderRadius:20, fontSize:'0.78rem', fontWeight:600 }}>{v}</div>
                    </div>
                  ))}
                  <button className="settings-card .btn-secondary" style={{ width:'100%', marginTop:6, padding:'10px', borderRadius:8, border:'1.5px solid var(--border)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, fontSize:'0.88rem', cursor:'pointer' }} onClick={() => showToast('Settings managed by server administrator.', 'info')}>Request Change</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay dash open">
          <div className="modal-box">
            <div className="modal-head"><h3>👤 Add New User</h3><button className="modal-close-btn" onClick={() => setShowAddUser(false)}>✕</button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label>Full Name *</label><input className="form-control" value={nuName} onChange={e => setNuName(e.target.value)} placeholder="John Doe" /></div>
                <div className="form-group"><label>Role *</label>
                  <select className="form-control" value={nuRole} onChange={e => setNuRole(e.target.value)}>
                    <option value="student">Student</option><option value="trainer">Trainer</option><option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Email *</label><input className="form-control" value={nuEmail} onChange={e => setNuEmail(e.target.value)} type="email" placeholder="user@example.com" /></div>
              <div className="form-group"><label>Temporary Password *</label><input className="form-control" value={nuPw} onChange={e => setNuPw(e.target.value)} type="password" placeholder="Min. 8 characters" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn-sm" onClick={() => setShowAddUser(false)}>Cancel</button>
              <button className="btn-sm btn-sm-primary" style={{ padding:'8px 20px' }} onClick={handleCreateUser}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Courses Modal */}
      {assignUser && (
        <div className="modal-overlay dash open">
          <div className="modal-box">
            <div className="modal-head"><h3>📚 Assign Courses</h3><button className="modal-close-btn" onClick={() => setAssignUser(null)}>✕</button></div>
            <div className="modal-body">
              <p style={{ fontSize:'0.88rem', color:'var(--text-secondary)', marginBottom:14 }}>Assigning courses to <strong>{assignUser.name}</strong></p>
              <div className="checkbox-list">
                {courses.map(c => (
                  <label key={c.id}>
                    <input type="checkbox" checked={selectedCourseIds.includes(c.id)} onChange={e => setSelectedCourseIds(prev => e.target.checked ? [...prev, c.id] : prev.filter(x => x !== c.id))} />
                    {c.icon} {c.title} <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:8 }}>{c.category}</span>
                  </label>
                ))}
                {courses.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>No courses available.</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-sm" onClick={() => setAssignUser(null)}>Cancel</button>
              <button className="btn-sm btn-sm-primary" style={{ padding:'8px 20px' }} onClick={handleAssign}>Save Assignments</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
