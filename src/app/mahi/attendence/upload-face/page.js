"use client";
import { useState, useRef } from 'react';

export default function UploadFace() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [studentData, setStudentData] = useState({
    rollNo: '',
    phoneNumber: ''
  });
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };

  const searchStudent = async () => {
    if (!studentData.rollNo && !studentData.phoneNumber) {
      setMessage('Please enter roll number or phone number');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (studentData.rollNo) params.append('rollNo', studentData.rollNo);
      if (studentData.phoneNumber) params.append('phoneNumber', studentData.phoneNumber);

      const response = await fetch(`/api/attendence/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setStudent(data.data);
        setMessage('Student found! You can now capture their face.');
      } else {
        setStudent(null);
        setMessage('Student not found. Please check the details.');
      }
    } catch (error) {
      setMessage('Error searching for student');
      console.error(error);
    }
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCapturing(true);
      setMessage('Camera started. Position your face in the frame.');
    } catch (error) {
      setMessage('Cannot access camera. Please check permissions.');
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
      setMessage('Camera stopped.');
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    setMessage('Image captured! Click "Upload Face" to save.');

    // Stop camera after capture
    stopCamera();
  };

  const uploadFace = async () => {
    if (!capturedImage || !student) {
      setMessage('Please capture an image first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/attendence/${student._id}/face-encoding.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: capturedImage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Face uploaded successfully!');
        setCapturedImage(null);
        setStudent(null);
        setStudentData({ rollNo: '', phoneNumber: '' });
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error uploading face');
      console.error(error);
    }
    setLoading(false);
  };

  return (
      <div className="container">
        <h1>Upload Student Face</h1>
        
        {/* Student Search */}
        <div className="search-section">
          <h2>Find Student</h2>
          <div className="input-group">
            <input
              type="text"
              name="rollNo"
              placeholder="Roll Number"
              value={studentData.rollNo}
              onChange={handleInputChange}
            />
            <span>OR</span>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={studentData.phoneNumber}
              onChange={handleInputChange}
            />
            <button onClick={searchStudent} disabled={loading}>
              {loading ? 'Searching...' : 'Search Student'}
            </button>
          </div>
        </div>

        {student && (
          <div className="student-info">
            <h3>Student Found:</h3>
            <p><strong>Name:</strong> {student.fullName}</p>
            <p><strong>Roll No:</strong> {student.rollNo}</p>
            <p><strong>Course:</strong> {student.selectedCourse}</p>
          </div>
        )}

        {/* Face Capture */}
        {student && (
          <div className="capture-section">
            <h2>Capture Face</h2>
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="video-preview"
                style={{ display: isCapturing ? 'block' : 'none' }}
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              
              {capturedImage && (
                <div className="captured-image">
                  <img src={capturedImage} alt="Captured face" />
                </div>
              )}
            </div>

            <div className="controls">
              {!isCapturing && !capturedImage ? (
                <button onClick={startCamera} className="btn-primary">
                  Start Camera
                </button>
              ) : isCapturing ? (
                <>
                  <button onClick={captureImage} className="btn-success">
                    Capture Image
                  </button>
                  <button onClick={stopCamera} className="btn-secondary">
                    Stop Camera
                  </button>
                </>
              ) : (
                <button onClick={uploadFace} disabled={loading} className="btn-primary">
                  {loading ? 'Uploading...' : 'Upload Face'}
                </button>
              )}
            </div>
          </div>
        )}

        {message && <div className="message">{message}</div>}

        <style jsx>{`
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          .search-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .input-group {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
          }
          input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            flex: 1;
            min-width: 150px;
          }
          .student-info {
            background: #f0f9ff;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .camera-container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto 1rem;
            border: 2px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            aspect-ratio: 4/3;
          }
          .video-preview, .captured-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .captured-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: 120px;
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .btn-primary {
            background-color: #0070f3;
            color: white;
          }
          .btn-success {
            background-color: #10b981;
            color: white;
          }
          .btn-secondary {
            background-color: #6b7280;
            color: white;
          }
          .message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            background: #f3f4f6;
            text-align: center;
          }
        `}</style>
      </div>
  );
}