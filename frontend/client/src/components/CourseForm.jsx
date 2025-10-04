import { useState } from 'react';
import { adminAPI } from '../services/api';

const CourseForm =({ onCourseCreated })=>{
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageURL: '',
    price: ''
  });
  const[message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =async (e) =>{
    e.preventDefault();
    try {
      const response = await adminAPI.createCourse(formData);
      setMessage(response.data.msg);
      setFormData({ title: '', description: '', imageURL: '', price: '' });
      if (onCourseCreated) onCourseCreated();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.msg || 'Something went wrong'));
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="url"
            name="imageURL"
            placeholder="Image URL"
            value={formData.imageURL}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Course</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CourseForm;


