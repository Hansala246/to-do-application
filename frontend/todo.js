document.addEventListener('DOMContentLoaded', () => {
    const createTaskForm = document.getElementById('createTaskForm');
    const taskList = document.getElementById('taskList');
    const updateTaskFormContainer = document.getElementById('updateTaskFormContainer');
    const updateTaskForm = document.getElementById('updateTaskForm');

    const token = localStorage.getItem('token');

    let currentTaskId = null; // Store the task ID being updated

    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const data = {
            'task_id': '',
            'task': formData.get('task'),
            'completed': 'false', // Convert string to boolean
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
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('button', 'update-button'); // Add CSS classes
        updateButton.addEventListener('click', () => showUpdateForm(task_id));
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('button', 'delete-button'); // Add CSS classes
        deleteButton.addEventListener('click', () => deleteTask(task_id));
    
        const markCompletedButton = document.createElement('button');
        markCompletedButton.textContent = 'Mark as Completed';
        markCompletedButton.classList.add('button', 'mark-completed-button'); // Add CSS classes
        markCompletedButton.addEventListener('click', () => markAsCompleted(task_id));
    
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons-container'); // Add flexbox container class
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
                taskItem.classList.add('task-item'); // Add CSS class
    
                // Format due_date to a readable format
                const formattedDueDate = new Date(task.due_date).toLocaleString();
                const taskDetails = document.createElement('div');
                taskDetails.classList.add('task-details');
                taskDetails.innerHTML = `
                    <strong class="task-label">Task:</strong> <span class="task-value">${task.task}</span><br>
                    <strong class="due-date-label">Due Date:</strong> <span class="due-date-value">${formattedDueDate}</span><br>
                    <strong class="priority-label">Priority:</strong> <span class="priority-value">${task.priority}</span><br>
                    <strong class="task-id-label">Task ID:</strong> <span class="task-id-value">${task.task_id}</span>
                `;
                taskItem.appendChild(taskDetails);
                taskItem.appendChild(createTaskButtons(task.task_id));
                taskList.appendChild(taskItem);
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Error loading tasks');
        }
    }
    
    if (token) {
        loadTasks();
    }

    function showUpdateForm(task_id) {
        currentTaskId = task_id;
        console.log('Update Task ID:', task_id);
        updateTaskFormContainer.style.display = 'block';
        const taskItem = document.querySelector(`.task-id-value:contains(${task_id})`).parentElement;
        const taskValue = taskItem.querySelector('.task-value').textContent;
        const dueDateValue = new Date(taskItem.querySelector('.due-date-value').textContent).toISOString().split('T')[0];
        const priorityValue = taskItem.querySelector('.priority-value').textContent;

        updateTaskForm.elements['task'].value = taskValue;
        updateTaskForm.elements['due_date'].value = dueDateValue;
        updateTaskForm.elements['priority'].value = priorityValue;
    }

    updateTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(updateTaskForm);
        const updatedTask = {
            'task_id': currentTaskId,
            'task': formData.get('task'),
            'completed': 'false',
            'task': formData.get('task'),
            'due_date': new Date(formData.get('due_date')).toISOString(),
            'priority': parseInt(formData.get('priority'))
        };
        updateTask(currentTaskId, updatedTask);
    });

    async function updateTask(task_id, updatedTask) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask) // Use updated task data
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
            updateTaskFormContainer.style.display = 'none'; // Hide the update form
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
