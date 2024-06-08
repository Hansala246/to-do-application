# Task Management Service

This service provides a simple yet powerful API for managing tasks. It allows users to create, retrieve, update, delete, and reorder tasks in a personalized task list. Each task is associated with a user account, ensuring that tasks are private and secure.

## Features

- **Create Tasks**: Users can add new tasks to their list.
- **Retrieve Tasks**: Users can view their tasks, with options to sort and filter based on completion status, due date, or priority.
- **Update Tasks**: Users can modify the details of an existing task.
- **Delete Tasks**: Users can remove tasks from their list.

## Endpoints

### Create Task

- **Method**: POST
- **Path**: `/tasks`
- **Description**: Adds a new task to the user's task list.

### Get Tasks

- **Method**: GET
- **Path**: `/tasks`
- **Description**: Retrieves tasks for the current user, with optional sorting and filtering.

### Delete Task

- **Method**: DELETE
- **Path**: `/tasks/{task_id}`
- **Description**: Removes a task from the user's task list.

### Reorder Task

- **Method**: PUT
- **Path**: `/tasks/{task_id}/reorder`
- **Description**: Changes the order of a task in the user's task list.

## Setup

To set up the service, ensure you have Python and MongoDB installed. Follow these steps:

1. Clone the repository.
2. Install the required Python packages: `pip install -r requirements.txt`
3. Ensure MongoDB is running.
4. Start the service: `python app.py`


## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
