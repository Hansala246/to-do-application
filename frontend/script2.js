document.addEventListener('DOMContentLoaded', () => {
    const createTaskForm = document.getElementById('createTaskForm');
    const taskList = document.getElementById('taskList');

    const token = localStorage.getItem('token');

    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const data = {
            'task': formData.get('task'),
            'completed':  'false', // Convert string to boolean
            'due_date': new Date(formData.get('due_date')).toISOString(), // Format due_date
            'priority': parseInt(formData.get('priority'))
        };
        console.log('Create Task Data:', data);
    
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Set content type
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response:', errorData); // Log the response data
                const errorMessage = errorData.detail || 'Unknown error';
                throw new Error(errorMessage);
            }
    
            const result = await response.json();
            console.log('Create Task Response:', result);
            alert(result.message);
            loadTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Error creating task: ${error.message}`);
        }
    });

    function createTaskButtons(task_id) {
        // updateButton.addEventListener('click', () => {
        //     // Toggle display of update form
        //     const updateForm = document.getElementById(`updateTaskForm_${task_id}`);
        //     if (updateForm.style.display === 'none') {
        //         updateForm.style.display = 'block';
        //     } else {
        //         updateForm.style.display = 'none';
        //     }
        // });

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('button', 'update-button'); // Add CSS classes
        updateButton.addEventListener('click', () => updateTask(task_id));
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('button', 'delete-button'); // Add CSS classes
        deleteButton.addEventListener('click', () => deleteTask(task_id));
    
        const markCompletedButton = document.createElement('button');
        markCompletedButton.textContent = 'Mark as Completed';
        markCompletedButton.classList.add('button', 'mark-completed-button'); // Add CSS classes
        markCompletedButton.addEventListener('click', () => markAsCompleted(task_id));
    
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(markCompletedButton);
    
        return buttonsDiv;
    }
    
    
    async function loadTasks() {
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const tasks = await response.json();
            console.log('Fetched Tasks:', tasks);
    
            taskList.innerHTML = '';
            tasks.forEach(task => {
                console.log('Task:', task);
                const taskItem = document.createElement('li');
                // Format due_date to a readable format
                const formattedDueDate = new Date(task.due_date).toLocaleString();
                taskItem.textContent = `Task: ${task.task}, Due Date: ${formattedDueDate}, Priority: ${task.priority}, Task ID: ${task.task_id}`;
                taskList.appendChild(taskItem);
                taskList.appendChild(createTaskButtons(task.task_id));;
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Error loading tasks');
        }
    }
    

    if (token) {
        loadTasks();
    }
    async function updateTask(task_id, updatedTask) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: updatedTask }) // Use updated task data
            });
    
            const result = await response.json();
            console.log('Update Task Response:', result);
    
            if (!response.ok) {
                console.error('Error Response:', result);
                const errorMessage = result.detail || 'Unknown error';
                throw new Error(errorMessage);
            }
    
            alert(result.message);
            loadTasks(); // Reload tasks after updating
        } catch (error) {
            console.error('Error updating task:', error);
            alert(`Error updating task: ${error.message}`);
        }
    }
    

    // Function to delete a task
    async function deleteTask(task_id) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            console.log('Delete Task Response:', result);

            if (!response.ok) {
                console.error('Error Response:', result);
                const errorMessage = result.detail || 'Unknown error';
                throw new Error(errorMessage);
            }

            alert(result.message);
            loadTasks(); // Reload tasks after deleting
        } catch (error) {
            console.error('Error deleting task:', error);
            alert(`Error deleting task: ${error.message}`);
        }
    }

    // Function to mark a task as completed
    async function markAsCompleted(task_id) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task_id}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            console.log('Mark as Completed Response:', result);

            if (!response.ok) {
                console.error('Error Response:', result);
                const errorMessage = result.detail || 'Unknown error';
                throw new Error(errorMessage);
            }

            alert(result.message);
            loadTasks(); // Reload tasks after marking as completed
        } catch (error) {
            console.error('Error marking task as completed:', error);
            alert(`Error marking task as completed: ${error.message}`);
        }
    }
});


