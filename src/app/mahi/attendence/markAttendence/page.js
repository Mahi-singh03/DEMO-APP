"use client";
import { useState, useRef, useEffect } from 'react';

export default function Attendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isScanningRef = useRef(false);
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [recognizedStudent, setRecognizedStudent] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [todayAttendance, setTodayAttendance] = useState([]);

  // Load today's attendance
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch('/api/attendence/today');
      const data = await response.json();
      if (data.success) {
        setTodayAttendance(data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsScanning(true);
      isScanningRef.current = true;
      setMessage('Camera started. Please face the camera for recognition.');
      
      // Start continuous face recognition
      startFaceRecognition();
    } catch (error) {
      setMessage('Cannot access camera. Please check permissions.');
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
      isScanningRef.current = false;
      setMessage('Camera stopped.');
    }
  };

  const startFaceRecognition = () => {
    // Continuous face recognition loop
    const interval = setInterval(async () => {
      if (!isScanningRef.current) {
        clearInterval(interval);
        return;
      }

      try {
        // Capture current frame
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Send to recognition API
        const response = await fetch('/api/attendence/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        const data = await response.json();
        if (data.success && data.student) {
          setRecognizedStudent(data.student);
          setIsScanning(false);
          isScanningRef.current = false;
          stopCamera();
          setMessage(`Recognized: ${data.student.fullName} (${data.student.rollNo})`);
        } else if (!data.success) {
          if (data.detectedFace === false) {
            setMessage(data.message || 'No face detected. Ensure good lighting and face is centered.');
          } else {
            setMessage('Student not recognized. If you are a student, please register your face.');
          }
        }
      } catch (error) {
        console.error('Recognition error:', error);
      }
    }, 2000); // Check every 2 seconds
  };

  const markAttendance = async () => {
    if (!recognizedStudent) return;

    setLoading(true);
    try {
      const response = await fetch('/api/attendence/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: recognizedStudent._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAttendanceMarked(true);
        setMessage(`Attendance marked for ${recognizedStudent.fullName}`);
        fetchTodayAttendance(); // Refresh today's attendance
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error marking attendance');
      console.error(error);
    }
    setLoading(false);
  };

  const resetScanner = () => {
    setRecognizedStudent(null);
    setAttendanceMarked(false);
    setMessage('');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
      <div className="container">
        <h1>Mark Attendance</h1>
        
        {/* Attendance Scanner */}
        <div className="scanner-section">
          <h2>Face Recognition Attendance</h2>
          
          <div className="scanner-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-preview"
              style={{ display: isScanning ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            
            {recognizedStudent && !attendanceMarked && (
              <div className="recognized-student">
                <h3>Student Recognized:</h3>
                <p><strong>Name:</strong> {recognizedStudent.fullName}</p>
                <p><strong>Roll No:</strong> {recognizedStudent.rollNo}</p>
                <p><strong>Course:</strong> {recognizedStudent.selectedCourse}</p>
                <button onClick={markAttendance} disabled={loading} className="btn-primary">
                  {loading ? 'Marking...' : 'Mark Attendance'}
                </button>
              </div>
            )}

            {attendanceMarked && (
              <div className="attendance-success">
                <h3>✅ Attendance Marked Successfully!</h3>
                <button onClick={resetScanner} className="btn-secondary">
                  Scan Next Student
                </button>
              </div>
            )}

            {!recognizedStudent && !isScanning && (
              <div className="scanner-placeholder">
                <p>Click "Start Camera" to begin facial recognition</p>
              </div>
            )}
          </div>

          <div className="scanner-controls">
            {!isScanning && !recognizedStudent ? (
              <button onClick={startCamera} className="btn-primary">
                Start Camera
              </button>
            ) : isScanning ? (
              <button onClick={stopCamera} className="btn-secondary">
                Stop Camera
              </button>
            ) : null}
          </div>
        </div>

        {message && <div className="message">{message}</div>}

        {/* Today's Attendance List */}
        <div className="attendance-list">
          <h2>Today's Attendance ({new Date().toLocaleDateString()})</h2>
          {todayAttendance.length === 0 ? (
            <p>No attendance marked yet today.</p>
          ) : (
            <div className="attendance-table">
              <div className="table-header">
                <span>Name</span>
                <span>Roll No</span>
                <span>Time</span>
                <span>Status</span>
              </div>
              {todayAttendance.map((record, index) => (
                <div key={index} className="table-row">
                  <span>{record.studentId?.fullName || 'N/A'}</span>
                  <span>{record.rollNo}</span>
                  <span>{formatTime(record.checkInTime)}</span>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
          }
          .scanner-section {
            margin-bottom: 3rem;
            padding: 1.5rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fafafa;
          }
          .scanner-container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto 1rem;
            border: 2px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            aspect-ratio: 4/3;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .video-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .recognized-student, .attendance-success, .scanner-placeholder {
            padding: 1rem;
            text-align: center;
          }
          .scanner-controls {
            text-align: center;
          }
          button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: 120px;
            margin: 0.5rem;
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .btn-primary {
            background-color: #0070f3;
            color: white;
          }
          .btn-secondary {
            background-color: #6b7280;
            color: white;
          }
          .message {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            background: #f3f4f6;
            text-align: center;
          }
          .attendance-list {
            margin-top: 2rem;
          }
          .attendance-table {
            display: flex;
            flex-direction: column;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .table-header, .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 0.75rem;
            gap: 1rem;
          }
          .table-header {
            background: #f3f4f6;
            font-weight: bold;
          }
          .table-row {
            border-top: 1px solid #eee;
          }
          .table-row:nth-child(even) {
            background: #fafafa;
          }
          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            text-align: center;
          }
          .status.present {
            background: #d1fae5;
            color: #065f46;
          }
          .status.late {
            background: #fef3c7;
            color: #92400e;
          }
        `}</style>
      </div>
  );
}