import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Placeholder for API call
            const response = await axios.post('/api/login', formData); // Replace '/api/login' with your actual API endpoint
            console.log('Login successful:', response.data);
            // Handle success (e.g., store token, redirect)
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
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
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;