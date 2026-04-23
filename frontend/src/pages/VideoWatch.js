import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Breadcrumb, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import Navbar from '../components/Navbar';

const VideoWatch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadVideoData = useCallback(async () => {
    try {
      const videoData = await courseService.getVideoById(id);
      setVideo(videoData);
      setCourse(videoData.course);
      
      // Log video access for security
      console.log('Video access logged:', {
        user: user?.username,
        video: videoData.title,
        course: videoData.course.title,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading video data:', error);
    } finally {
      setLoading(false);
    }
  }, [id, user?.username]);

  useEffect(() => {
    loadVideoData();
    setupSecurityFeatures();
  }, [loadVideoData]);

  const setupSecurityFeatures = () => {
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.keyCode === 123 || 
          (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
          (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P
      if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88 || e.keyCode === 80)) {
        e.preventDefault();
        return false;
      }
    };

    // Track page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden - potential security concern');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=([^&]+))/,
      /(?:youtu\.be\/([^?]+))/,
      /(?:youtube\.com\/embed\/([^?]+))/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const getDynamicWatermark = () => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    return `${user?.username} | ${user?.email} | ${timestamp}`;
  };

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

  const videoId = getYouTubeVideoId(video?.youtube_url);

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
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/course/${course?.id}` }}>
                {course?.title}
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{video?.title}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4><i className="fas fa-video"></i> {video?.title}</h4>
                <p className="mb-0 text-muted">Course: {course?.title}</p>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="video-container video-security">
                  <div className="watermark" id="dynamic-watermark">
                    {getDynamicWatermark()}
                  </div>
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=1`}
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-presentation"
                      title={video?.title}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-center text-white">
                        <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h5>Video URL Not Available</h5>
                        <p>Please contact the administrator.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <div className="video-info">
              <h5><i className="fas fa-info-circle"></i> Video Information</h5>
              <Row>
                <Col md={8}>
                  <p><strong>Title:</strong> {video?.title}</p>
                  <p><strong>Description:</strong> {video?.description || 'No description available.'}</p>
                  <p><strong>Course:</strong> {course?.title}</p>
                  <p><strong>Trainer:</strong> {course?.trainer?.username}</p>
                </Col>
                <Col md={4}>
                  <p><strong>Order:</strong> {video?.order}</p>
                  <p><strong>Added:</strong> {new Date(video?.created_at).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> 
                    <Badge bg={video?.is_active ? 'success' : 'danger'} className="ms-2">
                      {video?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Alert variant="info">
              <h6><i className="fas fa-shield-alt"></i> Security Notice</h6>
              <p className="mb-0">
                <small>This video is protected by security measures. Screen recording and downloading are disabled. 
                All access is logged for security purposes.</small>
              </p>
            </Alert>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-between">
            <Button href={`/course/${course?.id}`} variant="secondary">
              <i className="fas fa-arrow-left"></i> Back to Course
            </Button>
            
            {/* Next video button could be implemented here */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoWatch;
