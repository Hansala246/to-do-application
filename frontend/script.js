// Get the form element
const form = document.getElementById('loginForm');

// Add event listener for form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Validate email and password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (validateEmail(email) && validatePassword(password)) {
        // Form is valid, send the login request to the backend
        try {
            const response = await fetch('http://127.0.0.1:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${email}&password=${password}`,
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            const { access_token } = data;

            // Store the token in local storage
            localStorage.setItem('token', access_token);

            // Redirect or perform other actions as needed
            console.log('Login successful');
            console.log('Token:', access_token);

            // Example: Redirect to a different page
            window.location.href = 'todo2.html';
        } catch (error) {
            console.error('Login error:', error.message);
            showAlert('Invalid credentials');
        }
    } else {
        // Form is invalid, show an alert or error message
        showAlert('Please enter valid email and password');
    }
});

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password (you can add more complex validation if needed)
function validatePassword(password) {
    return password.length >= 6; // Example: Minimum 6 characters
}

// Function to show custom alert message
function showAlert(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('customAlert').style.display = 'flex';
}

// Function to close custom alert message
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

