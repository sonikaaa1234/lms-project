import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import Navbar from '../components/Navbar';

const AddVideo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    order: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      // Check permissions
      if (user?.role === 'trainer' && courseData.trainer.id !== user.id) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      navigate('/dashboard');
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
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await courseService.addVideo(id, formData);
      navigate(`/course/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add video');
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
                <li className="breadcrumb-item active">Add Video</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4><i className="fas fa-plus"></i> Add Video to {course?.title}</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter descriptive video title"
                    />
                    <Form.Text>Enter a descriptive title for the video</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>YouTube URL *</Form.Label>
                    <Form.Control
                      type="url"
                      name="youtube_url"
                      value={formData.youtube_url}
                      onChange={handleChange}
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <Form.Text>Paste the full YouTube video URL</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Video Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Optional video description"
                    />
                    <Form.Text>Optional description of the video content</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Video Order</Form.Label>
                    <Form.Control
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="0"
                    />
                    <Form.Text>Order in which videos should be displayed (0 = first)</Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button href={`/course/${id}`} variant="secondary">
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
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i> Add Video
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
                <h6><i className="fas fa-info-circle"></i> YouTube URL Examples</h6>
              </Card.Header>
              <Card.Body>
                <h6>Valid YouTube URLs:</h6>
                <ul className="list-unstyled small">
                  <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>• https://youtu.be/VIDEO_ID</li>
                </ul>
                <hr />
                <h6>Course Information:</h6>
                <p><strong>Title:</strong> {course?.title}</p>
                <p><strong>Trainer:</strong> {course?.trainer?.username}</p>
                <p><strong>Current Videos:</strong> 0</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddVideo;
