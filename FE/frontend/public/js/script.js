document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const updateProfileForm = document.getElementById('update-profile-form');
    const profileFormDiv = document.getElementById('profileForm');
    const viewProfileDiv = document.getElementById('viewProfile');
    const registrationFormDiv = document.getElementById('registrationForm');
    const loginFormDiv = document.getElementById('loginForm');

    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');
    const profileMessage = document.getElementById('profile-message');

    const profileUsernameSpan = document.getElementById('profile-username');
    const profileEmailSpan = document.getElementById('profile-email');

    const viewProfileButton = document.getElementById('view-profile');
    const backToProfileButton = document.getElementById('back-to-profile');
    const logoutButton = document.getElementById('logout');

    let authToken = localStorage.getItem('authToken');

    // Function to display messages
    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = 'message ' + type;
    }

    // Function to clear messages
    function clearMessage(element) {
        element.textContent = '';
        element.className = 'message';
    }

    // Function to show profile and hide other forms
    function showProfile() {
        registrationFormDiv.style.display = 'none';
        loginFormDiv.style.display = 'none';
        profileFormDiv.style.display = 'block';
        viewProfileDiv.style.display = 'none';
    }

     function showViewProfile() {
        registrationFormDiv.style.display = 'none';
        loginFormDiv.style.display = 'none';
        profileFormDiv.style.display = 'none';
        viewProfileDiv.style.display = 'block';
    }

    // Function to hide profile and show login/register forms
    function hideProfile() {
        registrationFormDiv.style.display = 'block';
        loginFormDiv.style.display = 'block';
        profileFormDiv.style.display = 'none';
        viewProfileDiv.style.display = 'none';
    }


    // Check if the user is already logged in
    if (authToken) {
        showProfile();
    } else {
        hideProfile();
    }

    // Registration Form Submission
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearMessage(registerMessage);

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Client-side validation
        if (!username || !email || !password) {
            displayMessage(registerMessage, 'Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            displayMessage(registerMessage, 'Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(registerMessage, data.message, 'success');
            } else {
                displayMessage(registerMessage, data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            displayMessage(registerMessage, 'An error occurred during registration', 'error');
        } finally {
            // No loading state to clear in this simplified example
        }
    });

    // Login Form Submission
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearMessage(loginMessage);

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

          // Client-side validation
        if (!username || !password) {
            displayMessage(loginMessage, 'Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                authToken = data.token;
                displayMessage(loginMessage, data.message, 'success');
                showProfile();
            } else {
                displayMessage(loginMessage, data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            displayMessage(loginMessage, 'An error occurred during login', 'error');
        } finally {
            // No loading state to clear in this simplified example
        }
    });

    // Update Profile Form Submission
    updateProfileForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearMessage(profileMessage);

        const email = document.getElementById('update-email').value;
        const password = document.getElementById('update-password').value;

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(profileMessage, data.message, 'success');
            } else {
                displayMessage(profileMessage, data.message || 'Profile update failed', 'error');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            displayMessage(profileMessage, 'An error occurred during profile update', 'error');
        } finally {
            // No loading state to clear in this simplified example
        }
    });

    // View Profile
    viewProfileButton.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                profileUsernameSpan.textContent = data.username;
                profileEmailSpan.textContent = data.email;
                showViewProfile();
            } else {
                displayMessage(profileMessage, data.message || 'Failed to load profile', 'error');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            displayMessage(profileMessage, 'An error occurred while fetching profile', 'error');
        } finally {
             // No loading state to clear in this simplified example
        }
    });

    // Back to Profile
    backToProfileButton.addEventListener('click', function(event) {
        event.preventDefault();
        showProfile();
    });


    // Logout
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('authToken');
        authToken = null;
        hideProfile();
    });
});