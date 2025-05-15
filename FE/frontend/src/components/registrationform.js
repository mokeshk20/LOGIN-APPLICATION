import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Placeholder for API call
            const response = await axios.post('/api/register', formData); // Replace '/api/register' with your actual API endpoint
            console.log('Registration successful:', response.data);
            // Handle success (e.g., redirect, display message)
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            // Handle error (e.g., display error message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;