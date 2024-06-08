# My Python Project

This is a todoapp project using fastapi and mongodb for backend.

## Setup

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install dependencies using `pip install -r requirements.txt`.


## Database congiguration

### Local MongoDB

If you prefer to use a local MongoDB instance, follow these steps:

1. Install MongoDB on your machine by downloading it from the official MongoDB website and following the installation instructions for your operating system.

2. Start the MongoDB service on your machine.

3. In your project's backend directory, create a file named `database.py` and add the following code:

    ```python
    # database.py
    
    MONGODB_URL = "mongodb://localhost:27017"
    ```

4. Save the file and make sure it is included in your project's `.gitignore` file to avoid committing sensitive information.

5. create database called TODO_App

### MongoDB Cluster

If you want to use a MongoDB cluster, follow these steps:

1. Sign up for a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).

2. Create a new cluster and configure it according to your needs.

3. In your project's backend directory, create a file named `database.py` and add the following code:

    ```python
    # database.py
    
    MONGODB_URL = "mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
    ```

    Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your MongoDB Atlas credentials and cluster details.

4. Save the file and make sure it is included in your project's `.gitignore` file to avoid committing sensitive information.

5. create database called TODO_App

Remember to import the `config` module in your project's code and use the `MONGODB_URL` variable to connect to the MongoDB database.

## How to run

1) Navigate to Project Directory:
Open your terminal or command prompt and navigate to the directory where your Python project and virtual environment are located.

2) Activate Virtual Environment using:
    .venv_\Scripts\activate  # For Windows
    .\venv\bin\activate  # For Linux/Mac

3) run the program using:
    uvicorn app.main:app --reload

Now you run the backend server.

## Usage

- Open your browser and navigate to `http://localhost:8000` to access the application.
- navigate the `http://localhost:8000/docs`.you can see your endpoints.