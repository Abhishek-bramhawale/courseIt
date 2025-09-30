import { useState, useEffect } from 'react';
import { courseAPI, userAPI } from '../services/api';

const CoursePreview = () =>{
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchCourses = async () =>{
    try {
      const response = await courseAPI.getCoursePreview();
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      setMessage('Error: '+ (error.response?.data?.msg || 'Failed to fetch courses'));
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await userAPI.getPurchases();
      setPurchases(response.data.purchases || []);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    }
  };

  const purchaseCourse = async (courseId) => {
    try {
      const response = await courseAPI.purchaseCourse(courseId);
      setMessage(response.data.msg);
      fetchPurchases();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.msg || 'Failed to purchase course'));
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPurchases();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  const isPurchased = (courseId) => {
    return purchases.some(purchase => purchase.courseId === courseId);
  };

  return (
    <div>
      <h2>Available Courses</h2>
      <button onClick={fetchCourses}>Refresh</button>
      {message && <p>{message}</p>}
      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              {course.imageUrl && <img src={course.imageUrl} alt={course.title}/>}
              <div>
                {isPurchased(course._id) ? (
                  <span>Purchased</span>
                ) : (
                  <button onClick={() => purchaseCourse(course._id)}>
                    Purchase Course
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePreview;


