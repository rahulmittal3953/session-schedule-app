# Multi-Tier Application (Session-Schedule-App) on Kubernetes (MongoDB + Node.js API)

This project demonstrates a simple multi-tier architecture deployed on Kubernetes using:
- A **Node.js** microservice (Service API Tier)
- A **MongoDB** database (DB Tier)

---

## Code Repository Link

- **Github Repository Link**: https://github.com/rahulmittal3953/session-schedule-app.git

---

## DockerHub Image Link

- **Dockerhub Image**: https://hub.docker.com/r/rahulmittal3953/session-schedule-app

---

## Service API URL

- **Service API URL**: http://34.54.231.33/tech/session/schedule

---

## Project Structure

```sh
session-schedule-app/
│
├── app/ # Node.js Express App (API Tier)
│ ├── index.js
│ ├── package.json
│ └── Dockerfile
│
├── k8s/ # Kubernetes YAMLs
│ ├── secret.yaml
│ ├── mongo-storage.yaml
│ ├── mongo-pvc.yaml
│ ├── mongo-deployment.yaml
│ ├── mongo-service.yaml
│ ├── configmap.yaml
│ ├── app-deployment.yaml
│ ├── app-service.yaml
│ └── ingress.yaml
│
└── README.md
```
---

## Prerequisites

- Node.js & npm
- Docker Hub account
- Google Cloud SDK (gcloud)
- GKE cluster set up
- `kubectl` configured to talk to GKE cluster

---

## Setup & Deployment

### 1. Build & Push Docker Image DockerHub

- Used the Cloud Shell to upload and build the docker image of the application
- Used below command to build and pushed the application image to dockerhub.

```bash
docker build -t rahulmittal3953/session-schedule-app:latest .
docker push rahulmittal3953/session-schedule-app:latest
```

### 2. Create Kubernetes Disk (Optional)

- Used below command to create the disk in Kubernetes, this step is optional if you want to create manually the disk

```bash
gcloud compute disks create mongo-disk --size=200GB --type=pd-standard --region=us-central1 --replica-zones=us-central1-a,us-central1-b
gcloud compute disks list
```
- To delete the disk
```bash
gcloud compute disks delete mongo-disk --region=us-central1
```

### 3. Create Kubernetes Secrets

- Used below command to create the secrets in Kubernetes

```bash
kubectl apply -f secret.yml
kubectl describe secret mongo-secret
```

### 4. Create Kubernetes Storage

- Used below command to create the storage in Kubernetes

```bash
kubectl apply -f mongo-storage.yml
kubectl describe storageclass mongo-storage
```

### 5. Create Kubernetes Presistance Volume - PV  (Optional)

- Used below command to create the Presistance Volume in Kubernetes, this step is optional if you want to create manually the Presistance Volume

```bash
kubectl apply -f mongo-pv.yml
kubectl describe pv mongo-pv
```

### 6. Create Kubernetes Presistance Volume Claim - PVC

- Used below command to create the Presistance Volume Claim in Kubernetes

```bash
kubectl apply -f mongo-pvc.yml
kubectl describe pvc mongo-pvc
```

### 7. Create Kubernetes Deployment for MongoDB (Database Tier)

- Used below command to create the MongoDB Deployment and spin up the 1 POD in Kubernetes

```bash
kubectl apply -f mongo-deployment.yml
kubectl describe deployment mongo
```

### 8. Create Kubernetes Servcice for MongoDB Deployment (Database Tier)

- Used below command to create the service for MongoDB deployment in Kubernetes

```bash
kubectl apply -f mongo-service.yml
kubectl describe service mongo-service
```

### 9. Create Kubernetes ConfigMap

- Used below command to create the app config map for Service Tier application in Kubernetes

```bash
kubectl apply -f configmap.yml
kubectl describe configmap app-config
```

### 10. Create Kubernetes Deployment for Application (Service API Tier)

- Used below command to create the Application Deployment and spin up the 4 POD in Kubernetes

```bash
kubectl apply -f app-deployment.yml
kubectl describe deployment session-schedule-app
```

### 11. Create Kubernetes Servcice for Application Deployment  (Service API Tier)

- Used below command to create the service for Application deployment in Kubernetes

```bash
kubectl apply -f app-service.yml
kubectl describe service session-schedule-app-service
```

### 12. Create Kubernetes Ingress to expose API externally

- Used below command to create the Ingress to exposre API externally in Kubernetes

```bash
kubectl apply -f ingress.yml
kubectl describe ingress session-schedule-app-ingress
```

## Kubernetes command that used for below Features Demonstrated

1. **Show all objects deployed and running:**
```bash
kubectl get all
kubectl get ingress
kubectl get configmap
kubectl get secrets
```
2. **Show an API call retrieving records from database:**
```bash
curl --location 'http://34.54.231.33/tech/session/schedule'
```
3. **Kill API microservice pod and show it regenerates:**
```bash
kubectl delete pod session-schedule-app-595966f597-6w5tk
kubectl get pods
```
4. **Kill database pod and show it regenerates and keeps old data:**
```bash
kubectl delete pod mongo-59232346f597-8wta5
kubectl get pods
curl --location 'http://34.54.231.33/tech/session/schedule'
```