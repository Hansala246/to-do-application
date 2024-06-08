document.getElementById('getDataBtn').addEventListener('click', fetchData);

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8000/api/data'); // Replace with your backend API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        document.getElementById('result').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
