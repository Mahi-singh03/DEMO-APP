"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

export default function NewStudent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    fatherName: '',
    motherName: '',
    parentsPhoneNumber: '',
    emailAddress: '',
    phoneNumber: '',
    dateOfBirth: '',
    aadharNumber: '',
    selectedCourse: '',
    courseDuration: '',
    address: '',
    qualification: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Student created successfully!' });
        setTimeout(() => {
          router.push(`/mahi/students/editStudent/${data.data._id}`);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create student' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating student' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Add New Student - Student Management System</title>
      </Head>

      <header>
        <Link href="/mahi/students/editStudent" className="btn-secondary">
          ← Back to Students
        </Link>
        <h1>Add New Student</h1>
        <div></div>
      </header>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fatherName">Father's Name *</label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motherName">Mother's Name *</label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="aadharNumber">Aadhar Number *</label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                pattern="[0-9]{12}"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emailAddress">Email Address *</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentsPhoneNumber">Parents Phone Number *</label>
              <input
                type="tel"
                id="parentsPhoneNumber"
                name="parentsPhoneNumber"
                value={formData.parentsPhoneNumber}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="selectedCourse">Selected Course *</label>
              <select
                id="selectedCourse"
                name="selectedCourse"
                value={formData.selectedCourse}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Course</option>
                <option value="HTML, CSS, JS">HTML, CSS, JS</option>
                <option value="ChatGPT and AI tools">ChatGPT and AI tools</option>
                <option value="Industrial Training">Industrial Training</option>
                <option value="React">React</option>
                <option value="MERN FullStack">MERN FullStack</option>
                <option value="CorelDRAW">CorelDRAW</option>
                <option value="Tally">Tally</option>
                <option value="Premier Pro">Premier Pro</option>
                <option value="WordPress">WordPress</option>
                <option value="Computer Course">Computer Course</option>
                <option value="MS Office">MS Office</option>
                <option value="PTE">PTE</option>
                <option value="AutoCAD">AutoCAD</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="courseDuration">Course Duration *</label>
              <select
                id="courseDuration"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Duration</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="qualification">Qualification *</label>
              <select
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Student...' : 'Create Student'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .student-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .form-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .form-actions {
          text-align: center;
          margin-top: 20px;
        }

        .form-actions button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }

        .form-actions button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .message {
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}