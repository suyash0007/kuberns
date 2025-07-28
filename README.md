# Project Overview

This is a full-stack web application with a Django backend and a react js frontend. The project is structured as a monorepo, with the backend and frontend code in separate directories but under the same root directory. The backend is responsible for the API, database management, and serving the static files of the compiled frontend.

## 1. Setup Instructions

To get the application up and running on your local machine, follow these steps.

**Prerequisites:**

* Python 3.10 or higher
* Node.js and npm
* Docker (for a local containerized environment)

**Backend Setup:**

1.  Navigate to the `backend` directory.
2.  Install the Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in the `backend` directory for your local database credentials and AWS credentials.
    ```ini
    # .env
    DB_NAME=your_local_db_name
    DB_USER=your_local_db_user
    DB_PASSWORD=your_local_db_password
    DB_HOST=your_local_db_host
    DB_PORT=your_local_db_port

    # AWS Credentials (for local development only)
    AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
    ```
    **Important:** Ensure your `.gitignore` file (in the project root) includes `/backend/.env` to prevent committing sensitive information.
4.  Run Django migrations to set up the database schema.
    ```bash
    python manage.py migrate
    ```
5.  Create a Django superuser (for accessing the Admin site).
    ```bash
    python manage.py createsuperuser
    ```
6.  Run the local development server.
    ```bash
    python manage.py runserver
    ```

**Frontend Setup:**

1.  Navigate to the `frontend/launchpad-deploy` directory.
2.  Install the Node.js dependencies.
    ```bash
    npm install
    ```
3.  Run the local development server.
    ```bash
    npm run dev
    ```

## 2. Design Decisions

* **Monorepo Structure:** The project is organized as a monorepo with a `/backend` and `/frontend` directory to keep the codebase cohesive while allowing for separate tooling and dependencies for each part of the stack.
* **Django as a Combined Backend:** Django is configured to handle both the API and to serve the compiled frontend assets. This simplifies deployment by only requiring one service to be managed.
* **Production Readiness:** Key settings for production, such as `DEBUG=False`, are separated into a `production.py` file to prevent security vulnerabilities and runtime errors during deployment. The application uses Gunicorn as a production-grade WSGI server instead of the development-only `runserver`.
* **API Security:** The project uses environment variables (`os.getenv`) to load sensitive credentials like database passwords and API keys, ensuring they are not hard-coded or committed to version control. For production, the recommended approach involves using IAM Roles to avoid storing credentials directly.

## 3. API Structure and Payloads

The API is built using Django REST Framework and is exposed at the `/api/` endpoint. The main endpoint demonstrated is for interacting with web applications.

* **Endpoint:** `POST /api/webapps/`
* **Description:** This endpoint is used to create and deploy a new web application instance based on provided specifications.
* **Request Payload:**
    ```json
    {
      "cpu": 1,
      "ram": 1024,
      "region": "us-east-1"
    }
    ```
* **Response Payload:**
    * **Success (200 OK):** A JSON response indicating the successful creation and the public IP address of the new instance.
        ```json
        {
          "message": "Instance launched successfully.",
          "ip_address": "54.211.12.34"
        }
        ```
    * **Error (500 Internal Server Error):** A JSON response with an error message.
        ```json
        {
          "status": "error",
          "message": "Error launching EC2 instance: An error occurred (UnrecognizedClientException)..."
        }
        ```

## 4. Time Taken and Limitations

* **Time Taken:** The project was built over multiple sessions, including setting up the Dockerfile, configuring Django settings, and troubleshooting deployment-related issues across both local and remote environments.
* **Limitations:**
    * **Deployment Platform Compatibility:** The current monorepo deployment approach might not be universally compatible with all hosting platforms without specific configurations or workarounds. Some platforms prefer separate services for backend and frontend.
    * **IAM Role Configuration Complexity:** While secure, setting up IAM roles and policies correctly can be complex and platform-specific, leading to authentication errors if not precisely configured.
