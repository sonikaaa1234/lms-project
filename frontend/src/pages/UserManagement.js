import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      
      const statsData = await userService.getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'trainer': return 'warning';
      case 'student': return 'info';
      default: return 'secondary';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <Container className="mt-4">
          <div className="alert alert-danger">
            <h4>Access Denied</h4>
            <p>You don't have permission to access this page.</p>
          </div>
        </Container>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-4">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2><i className="fas fa-users"></i> User Management</h2>
              <Button href="/users/create" variant="primary">
                <i className="fas fa-plus"></i> Create User
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-users"></i></h5>
                <h3 className="text-success">{stats.total_users || 0}</h3>
                <p className="card-text">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-user-graduate"></i></h5>
                <h3 className="text-primary">{stats.total_students || 0}</h3>
                <p className="card-text">Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-chalkboard-teacher"></i></h5>
                <h3 className="text-warning">{stats.total_trainers || 0}</h3>
                <p className="card-text">Trainers</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-user-shield"></i></h5>
                <h3 className="text-danger">{stats.total_admins || 0}</h3>
                <p className="card-text">Admins</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5><i className="fas fa-list"></i> All Users</h5>
              </Card.Header>
              <Card.Body>
                {users.length > 0 ? (
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={getRoleColor(user.role)}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td>{user.phone || '-'}</td>
                          <td>
                            <Badge bg={user.is_active ? 'success' : 'danger'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              {user.role === 'student' && (
                                <Button variant="info" size="sm" disabled title="View enrolled courses">
                                  <i className="fas fa-book"></i>
                                </Button>
                              )}
                              {user.role === 'trainer' && (
                                <Button variant="info" size="sm" disabled title="View courses">
                                  <i className="fas fa-chalkboard-teacher"></i>
                                </Button>
                              )}
                              {user.is_active ? (
                                <Button variant="warning" size="sm" disabled title="Disable user">
                                  <i className="fas fa-ban"></i>
                                </Button>
                              ) : (
                                <Button variant="success" size="sm" disabled title="Enable user">
                                  <i className="fas fa-check"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div>
                    <p className="text-muted">No users found.</p>
                    <Button href="/users/create" variant="primary">
                      <i className="fas fa-plus"></i> Create First User
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserManagement;
