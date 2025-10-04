import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await adminAPI.getCourses();
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.msg || 'Failed to fetch courses'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  const renderCourses = [];
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    renderCourses.push(
      <div
        key={course._id}
        style={{
          border: '1px solid #ccc',
          margin: '10px',
          padding: '10px',
        }}
      >
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p>Price: ${course.price}</p>
        {course.imageUrl && (
          <img
            src={course.imageUrl}
            alt={course.title}
            style={{ width: '100px', height: '100px' }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>My Courses</h2>
      <button onClick={fetchCourses}>Refresh</button>
      {message && <p>{message}</p>}
      {courses.length === 0 ? <p>No courses found</p> : <div>{renderCourses}</div>}
    </div>
  );
};

export default CourseList;
