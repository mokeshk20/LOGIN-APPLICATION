document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const loginError = document.getElementById('loginError');
    const registrationError = document.getElementById('registrationError');
    const registrationSuccess = document.getElementById('registrationSuccess');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token (e.g., in localStorage)
                localStorage.setItem('token', data.token);
                // Redirect to a protected page
                window.location.href = '/dashboard';
            } else {
                loginError.textContent = data.error || 'Login failed';
            }
        } catch (error) {
            loginError.textContent = 'Network error occurred';
        }
    });

    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const regUsername = document.getElementById('regUsername').value;
        const regPassword = document.getElementById('regPassword').value;
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: regUsername,
                    password: regPassword,
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                })
            });

            const data = await response.json();

            if (response.ok) {
                registrationSuccess.textContent = data.message || 'Registration successful';
                registrationError.textContent = '';
                // Optionally, redirect to login page or clear the form
                registrationForm.reset();
            } else {
                registrationError.textContent = data.error || 'Registration failed';
                registrationSuccess.textContent = '';
            }
        } catch (error) {
            registrationError.textContent = 'Network error occurred';
            registrationSuccess.textContent = '';
        }
    });
});