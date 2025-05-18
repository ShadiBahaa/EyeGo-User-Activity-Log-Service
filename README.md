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

## Architecture Choices

The architecture of the EyeGo User Activity Log Service is designed for scalability, reliability, and maintainability, following modern best practices for cloud-native applications:

- **Event-Driven Microservices:**  
  By leveraging Kafka as a message broker, the service decouples log ingestion from processing and storage. This allows for asynchronous handling of user activity logs, enabling high throughput and resilience to spikes in traffic.

- **Separation of Concerns (Domain-Driven Design):**  
  The codebase is organized into clear layers: API (controllers/routes), Application (services), Domain (entities/repositories), and Infrastructure (database and Kafka integrations). This separation makes the codebase easier to maintain, test, and extend.

- **Stateless API Layer:**  
  The REST API is stateless, making it easy to scale horizontally behind a load balancer in both Docker and Kubernetes environments.

- **Robust Data Storage:**  
  MongoDB is used for persistent storage of logs, chosen for its flexibility and scalability with large volumes of semi-structured data.

- **Graceful Shutdown and Health Checks:**  
  The service handles SIGINT/SIGTERM signals to ensure clean shutdown of Kafka and MongoDB connections, preventing data loss or corruption. The `/health` endpoint provides readiness and liveness checks for orchestration platforms.

- **Containerization and Orchestration:**  
  All components are containerized with Docker, and orchestration is supported via Docker Compose for local development and Kubernetes for production. This ensures consistent environments and easy deployment.

- **Developer Experience:**  
  Features like hot-reloading (nodemon), modular code, and test scripts are included to streamline development and onboarding for new contributors.

These choices collectively ensure that the service is robust, scalable, and easy to operate in both development and production environments.

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
