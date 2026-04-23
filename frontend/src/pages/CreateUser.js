import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await userService.createUser(formData);
      navigate('/users');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="/users">User Management</a></li>
                <li className="breadcrumb-item active">Create User</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          <Col md={8} lg={6}>
            <Card>
              <Card.Header>
                <h4><i className="fas fa-user-plus"></i> Create New User</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username *</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Enter unique username"
                    />
                    <Form.Text>Unique username for login</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                    />
                    <Form.Text>Email address for notifications</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                    />
                    <Form.Text>Minimum 8 characters</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                    <Form.Text>
                      <strong>Student:</strong> Can view enrolled courses<br />
                      <strong>Trainer:</strong> Can create and manage courses<br />
                      <strong>Admin:</strong> Full system access
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                    <Form.Text>Optional contact number</Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button href="/users" variant="secondary">
                      <i className="fas fa-arrow-left"></i> Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i> Create User
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6><i className="fas fa-info-circle"></i> User Guidelines</h6>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li><i className="fas fa-check text-success"></i> Use descriptive usernames</li>
                  <li><i className="fas fa-check text-success"></i> Provide valid email addresses</li>
                  <li><i className="fas fa-check text-success"></i> Assign appropriate roles</li>
                  <li><i className="fas fa-check text-success"></i> Use strong passwords</li>
                </ul>
                <hr />
                <h6>Next Steps:</h6>
                <ol className="small">
                  <li>Create the user</li>
                  <li>User receives login credentials</li>
                  <li>User can access the system</li>
                  <li>Assign courses if needed</li>
                </ol>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateUser;
