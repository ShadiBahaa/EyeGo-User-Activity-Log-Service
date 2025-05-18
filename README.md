# EyeGo User Activity Log Service

## Introduction

EyeGo User Activity Log Service is a scalable, event-driven microservice designed to capture, process, and store user activity logs in real-time. Built with Node.js, Kafka, and MongoDB, it leverages modern cloud-native patterns for reliability, scalability, and maintainability. The service exposes a RESTful API for log ingestion and querying, and is ready for deployment via Docker Compose or Kubernetes.

---

## Features

- **Event-Driven Architecture:** Uses Kafka for asynchronous log processing, decoupling ingestion from storage.
- **Scalable & Cloud-Native:** Easily deployable with Docker Compose or Kubernetes for horizontal scaling and resilience.
- **RESTful API:** Endpoints for creating, retrieving (with filtering and pagination), and deleting logs.
- **Robust Data Storage:** MongoDB with auto-incremented numeric IDs for logs.
- **Health Checks:** `/health` endpoint for readiness/liveness probes.
- **Graceful Shutdown:** Handles SIGINT/SIGTERM for clean resource release.
- **Clean Code Structure:** Follows Domain-Driven Design (DDD) principles for maintainability.
- **Developer Friendly:** Includes hot-reload (nodemon), test scripts, and clear modular organization.

---

## Project Structure
```
EyeGo-User-Activity-Log-Service/
├── k8s/
│   ├── zookeeper-deployment.yaml
│   ├── kafka-deployment.yaml
│   ├── mongo-deployment.yaml
│   ├── app-deployment.yaml
│   └── service.yaml
├── src/
│   ├── server.js
│   ├── api/
│   │   ├── controllers/
│   │   │   └── LogController.js
│   │   └── routes/
│   │       └── logRoutes.js
│   ├── application/
│   │   └── LogService.js
│   ├── domain/
│   │   ├── entities/
│   │   │   └── UserActivityLog.js
│   │   └── repositories/
│   │       └── ILogRepository.js
│   ├── infrastructure/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── kafka.js
│   │   ├── db/
│   │   │   └── MongoLogRepository.js
│   │   └── kafka/
│   │       ├── KafkaConsumer.js
│   │       └── KafkaProducer.js
│   └── shared/
│       └── utils.js
├── tests/
│   └── test.sh
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── README.md
├── package-lock.json
└── package.json
```

---

## Technologies Used

- **Node.js** (Express) – REST API server
- **Kafka** (kafkajs) – Event streaming platform
- **MongoDB** (mongoose) – Persistent log storage
- **Docker & Docker Compose** – Containerization and orchestration
- **Kubernetes** – Cloud-native deployment
- **Nodemon** – Hot-reloading for development
- **Shell scripts** – Health checks and test automation

---

## Installation & Running (Docker Compose)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ShadiBahaa/real-time-processing-microservice.git
   cd real-time-processing-microservice
   ```

2. **Copy and edit environment variables if needed:**
   ```sh
   cp .env.example .env
   # Edit .env as needed
   ```

3. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```

4. **Access the API:**
   - API root: [http://localhost:3000/](http://localhost:3000/)
   - Health check: [http://localhost:3000/health](http://localhost:3000/health)
   - Logs endpoint: [http://localhost:3000/api/logs](http://localhost:3000/api/logs)

5. **Run tests (optional):**
   ```sh
   ./tests/test.sh
   ```

---

## Installation & Running (Kubernetes)

1. **Build and push your Docker image (if not using Docker Hub):**
   ```sh
   docker build -t <your-dockerhub-username>/eyego-app:latest .
   docker push <your-dockerhub-username>/eyego-app:latest
   ```

2. **Apply Kubernetes manifests:**
   ```sh
   kubectl apply -f k8s/zookeeper-deployment.yaml
   kubectl apply -f k8s/kafka-deployment.yaml
   kubectl apply -f k8s/mongo-deployment.yaml
   kubectl apply -f k8s/app-deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. **Access the service:**
   - Use `kubectl get svc` to find the external IP or NodePort.
   - API will be available on port 3000.

---

## Screenshots

> _Add your screenshots here. Example:_

### API Health Check

![Health Endpoint Screenshot](screenshots/health.png)

### Log Creation

![Create Log Screenshot](screenshots/create-log.png)

### Log Query

![Query Logs Screenshot](screenshots/query-logs.png)

---

## License

MIT

---

## Author

[Shadi Bahaa](https://github.com/ShadiBahaa)
