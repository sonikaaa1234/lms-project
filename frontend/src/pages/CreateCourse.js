import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainer: ''
  });
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadTrainers();
    } else if (user?.role === 'trainer') {
      setFormData(prev => ({ ...prev, trainer: user.id }));
    }
  }, [user]);

  const loadTrainers = async () => {
    try {
      const usersData = await userService.getAllUsers();
      const trainersData = usersData.filter(u => u.role === 'trainer');
      setTrainers(trainersData);
    } catch (error) {
      console.error('Error loading trainers:', error);
    }
  };

  if (user?.role === 'student') {
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
      await courseService.createCourse(formData);
      navigate('/courses');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create course');
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
                <li className="breadcrumb-item"><a href="/courses">Course Management</a></li>
                <li className="breadcrumb-item active">Create Course</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4><i className="fas fa-plus"></i> Create New Course</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter descriptive course title"
                    />
                    <Form.Text>Enter a descriptive title for the course</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Course Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Provide detailed course description"
                    />
                    <Form.Text>Provide a detailed description of the course content</Form.Text>
                  </Form.Group>

                  {user?.role === 'admin' && (
                    <Form.Group className="mb-3">
                      <Form.Label>Assign Trainer *</Form.Label>
                      <Form.Select
                        name="trainer"
                        value={formData.trainer}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Trainer</option>
                        {trainers.map(trainer => (
                          <option key={trainer.id} value={trainer.id}>
                            {trainer.username} ({trainer.email})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text>Choose which trainer will manage this course</Form.Text>
                    </Form.Group>
                  )}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button href="/courses" variant="secondary">
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
                          <i className="fas fa-save"></i> Create Course
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
                <h6><i className="fas fa-info-circle"></i> Course Guidelines</h6>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li><i className="fas fa-check text-success"></i> Use descriptive titles</li>
                  <li><i className="fas fa-check text-success"></i> Provide clear descriptions</li>
                  <li><i className="fas fa-check text-success"></i> Assign appropriate trainers</li>
                  <li><i className="fas fa-check text-success"></i> Plan video content structure</li>
                </ul>
                <hr />
                <h6>Next Steps:</h6>
                <ol className="small">
                  <li>Create the course</li>
                  <li>Add YouTube video links</li>
                  <li>Enroll students (Admin only)</li>
                  <li>Publish the course</li>
                </ol>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateCourse;
