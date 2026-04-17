import { useState } from 'react';

export default function Sidebar({ navItems, role, activeSection, onNav }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="url(#sgrad)" />
          <path d="M8 14l12-6 12 6v12l-12 6-12-6V14z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M8 14l12 6 12-6M20 20v12" stroke="white" strokeWidth="2"/>
          <defs>
            <linearGradient id="sgrad" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor={role === 'admin' ? '#EF4444' : role === 'trainer' ? '#8B5CF6' : '#3B82F6'} />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="logo-text">EduVerse</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((group, gi) => (
          <div key={gi}>
            <span className="nav-section-label">{group.label}</span>
            {group.items.map(item => (
              <a
                key={item.section}
                href="#"
                className={`nav-link ${activeSection === item.section ? 'active' : ''}`}
                onClick={e => { e.preventDefault(); onNav(item.section); }}
              >
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    dangerouslySetInnerHTML={{ __html: item.iconPath }} />
                </span>
                <span className="nav-label">{item.title}</span>
                {item.badge != null && <span className="nav-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <button className="sidebar-collapse-btn" onClick={() => setCollapsed(c => !c)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={() => onNav('__logout__')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
