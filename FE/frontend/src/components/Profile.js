import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Placeholder for API call
                const response = await axios.get('/api/profile'); // Replace '/api/profile' with your actual API endpoint
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                // Handle error (e.g., redirect to login, display message)
            }
        };

        fetchProfile();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    if (!profileData) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>Username: {profileData.username}</p>
            <p>Email: {profileData.email}</p>
            {/* Display other profile information here */}
        </div>
    );
};

export default Profile;