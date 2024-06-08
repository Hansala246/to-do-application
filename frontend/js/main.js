document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('todoForm');
    const taskList = document.getElementById('taskList');
    const token = localStorage.getItem('token'); // Replace with your JWT token

    // Fetch and display tasks on page load
    fetchTasks();

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const taskInput = document.getElementById('task');
        const taskText = taskInput.value.trim();

        if (taskText) {
            await addTask(taskText);
            taskInput.value = '';
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const tasks = await response.json();
            console.log('Fetched tasks:', tasks);
            taskList.innerHTML = '';
            tasks.forEach(task => {
                displayTask(task);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function addTask(taskText) {
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ task_text: taskText })
            });
            const newTask = await response.json();
            console.log('Added task:', newTask);
            displayTask(newTask);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    function displayTask(task) {
        const li = document.createElement('li');
        li.className = 'task';
        li.innerHTML = `
            <span class="task-text">${task.task_text}</span>
            <div class="task-buttons">
                <button class="delete-task" onclick="deleteTask('${task.task_id}', this)">Delete</button>
                <button class="mark-as-completed" onclick="markAsCompleted('${task.task_id}', this)">Mark as Completed</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    window.deleteTask = async (taskId, button) => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log(`Deleted task with ID: ${taskId}`);
                const taskItem = button.closest('.task');
                taskItem.remove();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    window.markAsCompleted = async (taskId, button) => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log(`Marked task as completed with ID: ${taskId}`);
                const taskItem = button.closest('.task');
                taskItem.querySelector('.task-text').classList.add('completed');
            }
        } catch (error) {
            console.error('Error marking task as completed:', error);
        }
    };

    function closeAlert() {
        const alertBox = document.getElementById('customAlert');
        alertBox.style.display = 'none';
    }
});



// #script2.js
document.addEventListener('DOMContentLoaded', () => {
    const createTaskForm = document.getElementById('createTaskForm');
    const taskList = document.getElementById('taskList');

    const token = localStorage.getItem('token');

    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const data = {
            task: formData.get('task'),
            due_date: new Date(formData.get('due_date')).toISOString(),
            priority: parseInt(formData.get('priority'))
        };
        console.log('Create Task Data:', data);
    
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            console.log('Create Task Response:', result);

            if (!response.ok) {
                console.error('Error Response:', result);
                const errorMessage = result.detail || 'Unknown error';
                throw new Error(errorMessage);
            }
    
            alert(result.message);
            loadTasks(); // Reload tasks after creating a new one
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Error creating task: ${error.message}`);
        }
    });

    // Function to create task buttons
    function createTaskButtons(task_id) {
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateTask(task_id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task_id));

        const markCompletedButton = document.createElement('button');
        markCompletedButton.textContent = 'Mark as Completed';
        markCompletedButton.addEventListener('click', () => markAsCompleted(task_id));

        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(markCompletedButton);

        return buttonsDiv;
    }

    // Function to render tasks
    function renderTask(task) {
        const taskItem = document.createElement('li');
        const formattedDueDate = new Date(task.due_date).toLocaleString();
        taskItem.textContent = `Task: ${task.task}, Due Date: ${formattedDueDate}, Priority: ${task.priority}`;
        taskItem.appendChild(createTaskButtons(task.task_id)); // Attach buttons to the task item
        return taskItem;
    }

    // Function to load tasks
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
                const taskItem = renderTask(task);
                taskList.appendChild(taskItem);
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Error loading tasks');
        }
    }

    // Call loadTasks when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadTasks();
    });

    // Function to update a task
    async function updateTask(task_id) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: 'Updated Task' }) // Update with actual task data
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
