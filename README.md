# Assignment Management Platform

This project is a comprehensive **assignment management system** designed to streamline the process of distributing, submitting, reviewing, and tracking assignments in any collaborative setting—be it a classroom, club, or organization. The platform supports both individual and team-based workflows, making it flexible for a variety of educational and professional environments.

---

## Key Features

- **Assignment Creation:**  
  Admins or authorized users can create assignments, set deadlines, assign them to individuals or teams, and attach relevant files or subtasks.

- **Team & User Management:**  
  Users can be grouped into teams, and assignments can be allocated to either individuals or entire teams. Team membership and roles (admin, reviewer) are easily managed.

- **Submission Workflow:**  
  Users (or teams) can submit their work, upload attachments, and add comments. The system tracks all submissions and their statuses.

- **Review & Feedback:**  
  Reviewers can provide feedback, mark submissions as checked, and mark assignments as completed for each user or team independently. The review process is transparent and auditable.

- **Progress Tracking:**  
  Both users and admins can view pending assignments, submission history, and review history. The platform ensures that completion status is tracked per user/team allocation, not globally.

- **Secure & Scalable:**  
  All sensitive data and configuration are managed via environment variables. The system is containerized for easy deployment and scalability.

---

## Tech Stack

**Frontend:**
- [React] for a dynamic, responsive user interface  
- [Redux] for state management  
- [Material UI / Tailwind CSS] for modern, accessible UI components

**Backend:**
- [Django] REST Framework for robust API development  
- [PostgreSQL] as the relational database  
- [Docker] & Docker Compose for containerized, reproducible environments

---

## How to Setup

1. **Clone the repository**
   

2. **Create and populate an `.env` file at the root of the project**  
   (use the provided `.env.example` as a template if available):

    ```
    SECRET_KEY=your-django-secret-key
    DEBUG=True
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=db
    DB_PORT=5432
    ```

3. **Build and start the Docker containers:**
    ```bash
    docker compose up --build
    ```

4. **Access the application:**
    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Backend/API:** [http://localhost:8000](http://localhost:8000)
    - **Admin Panel:** [http://localhost:8000/admin](http://localhost:8000/admin) (create a superuser if needed)
