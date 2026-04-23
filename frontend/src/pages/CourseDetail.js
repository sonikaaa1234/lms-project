import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Breadcrumb } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import Navbar from '../components/Navbar';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCourseData = useCallback(async () => {
    try {
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      const videosData = await courseService.getCourseVideos(id);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCourseData();
  }, [id, loadCourseData]);

  
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
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{course?.title}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <h4><i className="fas fa-book"></i> {course?.title}</h4>
                  <p className="mb-0 text-muted">By {course?.trainer?.username}</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'trainer') && (
                  <div>
                    <Button
                      href={`/course/${id}/add-video`}
                      variant="primary"
                      className="me-2"
                    >
                      <i className="fas fa-plus"></i> Add Video
                    </Button>
                    {user?.role === 'admin' && (
                      <Button
                        href={`/course/${id}/enroll`}
                        variant="success"
                      >
                        <i className="fas fa-user-plus"></i> Enroll Student
                      </Button>
                    )}
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                <p>{course?.description}</p>
                <Row>
                  <Col md={6}>
                    <p><strong>Trainer:</strong> {course?.trainer?.username}</p>
                    <p><strong>Enrolled Students:</strong> {course?.students?.length || 0}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Total Videos:</strong> {videos.length}</p>
                    <p><strong>Status:</strong> 
                      <Badge bg={course?.is_active ? 'success' : 'danger'} className="ms-2">
                        {course?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5><i className="fas fa-video"></i> Course Videos</h5>
              </Card.Header>
              <Card.Body>
                {videos.length > 0 ? (
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video, index) => (
                        <tr key={video.id}>
                          <td>{index + 1}</td>
                          <td>{video.title}</td>
                          <td>{video.description?.substring(0, 50)}...</td>
                          <td>-</td>
                          <td>
                            <Button
                              href={`/video/${video.id}`}
                              variant="primary"
                              size="sm"
                            >
                              <i className="fas fa-play"></i> Watch
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div>
                    <p className="text-muted">No videos available for this course yet.</p>
                    {(user?.role === 'admin' || user?.role === 'trainer') && (
                      <Button href={`/course/${id}/add-video`} variant="primary">
                        <i className="fas fa-plus"></i> Add First Video
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {user?.role === 'admin' && course?.students?.length > 0 && (
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5><i className="fas fa-users"></i> Enrolled Students</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.students.map(student => (
                        <tr key={student.id}>
                          <td>{student.username}</td>
                          <td>{student.email}</td>
                          <td>{student.phone || '-'}</td>
                          <td>{new Date(student.date_joined).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default CourseDetail;
