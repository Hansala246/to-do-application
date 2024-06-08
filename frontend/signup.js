const form2 = document.getElementById('signupForm');

// Add event listener for form submission
form2.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Validate name, email, password, and confirm password
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (validateName(name) && validateEmail(email) && validatePassword(password) && confirmPassword === password) {
        // Form is valid, send data to backend
        const userData = {
            name: name,
            user_email: email,
            user_pw: password
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    const errorResponse = await response.json();
                    showAlert(errorResponse.detail);
                } else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
            } else {
                // User created successfully
                console.log('User created successfully');

                window.location.href = 'index.html';
                // You can redirect or show a success message here
            }
        } catch (error) {
            console.error('Error:', error);
            // Show an alert or error message to the user
            showAlert();
        }
    } else {
        // Form is invalid, show an alert or error message
        if (!validatePassword(password)) {
            showAlert('Please enter a stronger password (at least 4 characters)');
        } else {
            showAlert('Please enter valid information');
        }
    }
});

// Function to validate name
function validateName(name) {
    return name.trim().length > 0; // Check if name is not empty
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password (you can add more complex validation if needed)
function validatePassword(password) {
    return password.length >= 4; // Example: Minimum 4 characters
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

