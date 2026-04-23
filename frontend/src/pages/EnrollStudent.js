import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';

const EnrollStudent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      // Get students not enrolled in this course
      const allUsers = await userService.getAllUsers();
      const allStudents = allUsers.filter(u => u.role === 'student');
      const enrolledStudentIds = courseData.students.map(s => s.id);
      const availableStudents = allStudents.filter(s => !enrolledStudentIds.includes(s.id));
      setStudents(availableStudents);
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/dashboard');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await courseService.enrollStudent(id, selectedStudent);
      navigate(`/course/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to enroll student');
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
                <li className="breadcrumb-item"><a href={`/course/${id}`}>{course?.title}</a></li>
                <li className="breadcrumb-item active">Enroll Student</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4><i className="fas fa-user-plus"></i> Enroll Student in {course?.title}</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Student *</Form.Label>
                    <Form.Select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                    >
                      <option value="">Choose a student to enroll</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.username} ({student.email})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text>
                      Only students not currently enrolled are shown
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button href={`/course/${id}`} variant="secondary">
                      <i className="fas fa-arrow-left"></i> Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || !selectedStudent}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus"></i> Enroll Student
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
                <h6><i className="fas fa-info-circle"></i> Course Information</h6>
              </Card.Header>
              <Card.Body>
                <p><strong>Course:</strong> {course?.title}</p>
                <p><strong>Trainer:</strong> {course?.trainer?.username}</p>
                <p><strong>Current Students:</strong> {course?.students?.length || 0}</p>
                <p><strong>Total Videos:</strong> 0</p>
              </Card.Body>
            </Card>
            
            <Card className="mt-3">
              <Card.Header>
                <h6><i className="fas fa-users"></i> Currently Enrolled</h6>
              </Card.Header>
              <Card.Body>
                {course?.students?.length > 0 ? (
                  <ul className="list-unstyled small">
                    {course.students.map(student => (
                      <li key={student.id}>
                        <i className="fas fa-user"></i> {student.username}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small">No students enrolled yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EnrollStudent;
