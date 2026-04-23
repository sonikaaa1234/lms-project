import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import Navbar from '../components/Navbar';

const CourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
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
              <h2><i className="fas fa-book"></i> Course Management</h2>
              <Button href="/courses/create" variant="primary">
                <i className="fas fa-plus"></i> Create Course
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-book"></i></h5>
                <h3 className="text-primary">{courses.length}</h3>
                <p className="card-text">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-users"></i></h5>
                <h3 className="text-success">
                  {courses.reduce((sum, course) => sum + (course.student_count || 0), 0)}
                </h3>
                <p className="card-text">Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-video"></i></h5>
                <h3 className="text-warning">0</h3>
                <p className="card-text">Total Videos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <h5 className="card-title"><i className="fas fa-check-circle"></i></h5>
                <h3 className="text-info">{courses.filter(c => c.is_active).length}</h3>
                <p className="card-text">Active Courses</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5><i className="fas fa-list"></i> 
                  {user?.role === 'admin' ? 'All Courses' : 'My Courses'}
                </h5>
              </Card.Header>
              <Card.Body>
                {courses.length > 0 ? (
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Title</th>
                        {user?.role === 'admin' && <th>Trainer</th>}
                        <th>Description</th>
                        <th>Students</th>
                        <th>Videos</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td><strong>{course.title}</strong></td>
                          {user?.role === 'admin' && (
                            <td>{course.trainer?.username}</td>
                          )}
                          <td>{course.description?.substring(0, 50)}...</td>
                          <td>
                            <Badge bg="primary">{course.student_count || 0}</Badge>
                          </td>
                          <td>
                            <Badge bg="info">0</Badge>
                          </td>
                          <td>
                            <Badge bg={course.is_active ? 'success' : 'danger'}>
                              {course.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>{new Date(course.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                href={`/course/${course.id}`}
                                variant="primary"
                                size="sm"
                                title="View Course"
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button
                                href={`/course/${course.id}/add-video`}
                                variant="success"
                                size="sm"
                                title="Add Video"
                              >
                                <i className="fas fa-plus"></i>
                              </Button>
                              {user?.role === 'admin' && (
                                <Button
                                  href={`/course/${course.id}/enroll`}
                                  variant="info"
                                  size="sm"
                                  title="Enroll Student"
                                >
                                  <i className="fas fa-user-plus"></i>
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
                    <p className="text-muted">
                      {user?.role === 'admin' 
                        ? 'No courses found in the system.' 
                        : 'You haven\'t created any courses yet.'}
                    </p>
                    <Button href="/courses/create" variant="primary">
                      <i className="fas fa-plus"></i> Create Your First Course
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

export default CourseManagement;
