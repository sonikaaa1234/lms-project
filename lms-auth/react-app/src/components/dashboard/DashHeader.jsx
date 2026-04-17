import { useApp } from '../../context/useApp';
import { useNavigate } from 'react-router-dom';

export default function DashHeader({ title, role, children }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="dash-header">
      <div className="header-left">
        <span className="breadcrumb"><strong>{title}</strong></span>
      </div>
      <div className="header-right">
        {children}
        <div className="user-chip">
          <div
            className="user-avatar"
            style={{ background: role === 'admin' ? 'linear-gradient(135deg,#EF4444,#8B5CF6)' : role === 'trainer' ? 'linear-gradient(135deg,#8B5CF6,#3B82F6)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}
          >
            {initials}
          </div>
          <span className="user-name">{currentUser?.name}</span>
          <span className={`user-role-tag ${role}`}>{role}</span>
        </div>
        <button onClick={handleLogout} className="btn-sm btn-sm-danger" style={{ marginLeft: 8 }}>
          Logout
        </button>
      </div>
    </header>
  );
}
