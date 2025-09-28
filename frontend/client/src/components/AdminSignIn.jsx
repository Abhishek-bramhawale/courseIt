import { useState } from 'react';
import { adminAPI } from '../services/api';

const AdminSignIn = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.signIn(formData);
      localStorage.setItem('token', response.data);
      localStorage.setItem('userType', 'admin');
      setMessage('Successfully signed in!');
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.msg || 'Something went wrong'));
    }
  };

  return (
    <div>
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminSignIn;


