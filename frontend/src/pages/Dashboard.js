import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);

      if (user?.role === 'admin') {
        const statsData = await userService.getUserStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const renderAdminDashboard = () => (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h5 className="card-title"><i className="fas fa-users"></i></h5>
              <h3 className="text-primary">{stats.total_users || 0}</h3>
              <p className="card-text">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <h5 className="card-title"><i className="fas fa-user-graduate"></i></h5>
              <h3 className="text-success">{stats.total_students || 0}</h3>
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
              <h5 className="card-title"><i className="fas fa-book"></i></h5>
              <h3 className="text-info">{courses.length}</h3>
              <p className="card-text">Courses</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5><i className="fas fa-book"></i> All Courses</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Title</th>
                <th>Trainer</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>
                    <a href={`/course/${course.id}`}>{course.title}</a>
                  </td>
                  <td>{course.trainer?.username}</td>
                  <td>{course.students?.length || 0}</td>
                  <td>
                    <Badge bg={course.is_active ? 'success' : 'danger'}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      href={`/course/${course.id}`}
                      variant="primary"
                      size="sm"
                    >
                      <i className="fas fa-eye"></i> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );

  const renderTrainerDashboard = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5><i className="fas fa-book"></i> My Courses</h5>
        <Button href="/courses/create" variant="primary">
          <i className="fas fa-plus"></i> Create Course
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          {courses.map(course => (
            <Col key={course.id} md={6} lg={4} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {course.description?.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      <i className="fas fa-users"></i> {course.students?.length || 0} students
                    </small>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    href={`/course/${course.id}`}
                    variant="primary"
                    size="sm"
                    className="me-2"
                  >
                    <i className="fas fa-eye"></i> View Course
                  </Button>
                  <Button
                    href={`/course/${course.id}/add-video`}
                    variant="secondary"
                    size="sm"
                  >
                    <i className="fas fa-plus"></i> Add Video
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        {courses.length === 0 && (
          <div className="text-center">
            <p className="text-muted">You haven't created any courses yet.</p>
            <Button href="/courses/create" variant="primary">
              <i className="fas fa-plus"></i> Create Your First Course
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderStudentDashboard = () => (
    <Card>
      <Card.Header>
        <h5><i className="fas fa-book"></i> My Enrolled Courses</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {courses.map(course => (
            <Col key={course.id} md={6} lg={4} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {course.description?.substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      <i className="fas fa-chalkboard-teacher"></i> {course.trainer?.username}
                    </small>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    href={`/course/${course.id}`}
                    variant="primary"
                    size="sm"
                  >
                    <i className="fas fa-play"></i> Watch Videos
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        {courses.length === 0 && (
          <div className="text-center">
            <p className="text-muted">You are not enrolled in any courses yet.</p>
            <p className="text-muted">Please contact your administrator to get enrolled in courses.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2><i className="fas fa-tachometer-alt"></i> Dashboard</h2>
            <p className="text-muted">Welcome back, {user?.username}!</p>
          </Col>
        </Row>

        {user?.role === 'admin' && renderAdminDashboard()}
        {user?.role === 'trainer' && renderTrainerDashboard()}
        {user?.role === 'student' && renderStudentDashboard()}
      </Container>
    </>
  );
};

export default Dashboard;
