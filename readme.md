# Room Management System (Dockerized Fullstack Web App)

This project containerizes a complete Fullstack Web Application (Database, Backend API, and React Frontend) using **Docker** and **Docker Compose**, enforcing a sequential startup order and securing sensitive credentials via environment variables[cite: 4].

## 1. System Architecture

The system consists of 3 isolated containers communicating over an internal Docker network:
* **Database (`db_1`):** PostgreSQL database storing `room` and `category` records[cite: 2, 5].
* **Backend API (`api_1`):** Node.js (Restify & Knex.js) serving RESTful endpoints on port `8080`, configured to automatically run database migrations and seed initial data upon startup[cite: 2, 5].
* **Frontend (`frontend_1`):** ReactJS application running on port `3000`, fetching and displaying room listings via the Backend API[cite: 2, 4, 5].

**Startup Sequence:**
`Database (Healthy)` $\rightarrow$ `Backend API (Migrate + Seed + Healthy)` $\rightarrow$ `Frontend React`

---

## 2. Project Structure

```text
├── api-server/          # Backend API source code (Node.js, Knex migrations & seeds)[cite: 2, 6]
│   ├── migrations/      # Database schema migration files
│   ├── seeds/           # Initial sample data seed files[cite: 2]
│   ├── index.js         # API entry point[cite: 2]
│   ├── knexfile.js      # Knex database configuration[cite: 2]
│   └── Dockerfile       # Backend container build instructions[cite: 2]
├── frontend-react/      # Frontend user interface source code (React)[cite: 6]
│   ├── public/          # Static assets and HTML template[cite: 6]
│   ├── src/             # React components, styles, and API fetching logic[cite: 2, 6]
│   └── Dockerfile       # Frontend container build instructions[cite: 6]
├── docker-compose.yml   # Container orchestration and service configuration[cite: 6]
├── .env-sample          # Environment variable template[cite: 6]
└── readme.md            # Project documentation[cite: 6]
```

## 3. Setup and Running
### Instructions:
+ Step 1: Configure Environment Variables:

Copy .env-sample to .env in the root directory (alongside docker-compose.yml) and define your database connection parameters

+ Step 2: Build and Start the Application:

Open a terminal in the root directory and run:

```bash
docker-compose up --build
```

(Docker will initialize PostgreSQL, wait until the database accepts connections, trigger the API to execute migrations and seeds, and finally launch the React frontend)

+ Step 3: Access the ApplicationFrontend

Homepage: http://localhost:3000 

API Room Endpoint: http://localhost:8080/room 

(Note for GitHub Codespaces users: Make sure to change the visibility of Port 8080 to Public under the Ports tab so the frontend can successfully fetch data from the API)

### Stopping the Application: 

To stop and remove the running containers:

```bash
docker-compose down
```