import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'trainer': return 'warning';
      case 'student': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/dashboard">
          <i className="fas fa-graduation-cap"></i> LMS
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              <i className="fas fa-home"></i> Dashboard
            </Nav.Link>
            
            {user?.role === 'admin' && (
              <NavDropdown title={<span><i className="fas fa-users"></i> Users</span>} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/users">Manage Users</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/users/create">Create User</NavDropdown.Item>
              </NavDropdown>
            )}
            
            {['admin', 'trainer'].includes(user?.role) && (
              <NavDropdown title={<span><i className="fas fa-book"></i> Courses</span>} id="course-dropdown">
                <NavDropdown.Item as={Link} to="/courses">Manage Courses</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/courses/create">Create Course</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            <NavDropdown 
              title={
                <span>
                  <i className="fas fa-user"></i> {user?.username} 
                  <span className={`badge bg-${getRoleColor(user?.role)} ms-2`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </span>
              } 
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
