#!/bin/bash

# Build script for TraderPulse Backend

set -e

IMAGE_NAME="traderpulse-backend"
TAG="latest"

echo "Building Docker image: $IMAGE_NAME:$TAG"

# Build the Docker image
docker build -t $IMAGE_NAME:$TAG .

echo "Build completed successfully!"

echo ""
echo "To run locally:"
echo "docker run -p 8080:8080 --env-file .env $IMAGE_NAME:$TAG"
echo ""
echo "To test the API:"
echo "curl http://localhost:8080/health"
echo "curl http://localhost:8080/api/v1/quote/AAPL"
echo ""
echo "To deploy to Cloud Run:"
echo "gcloud run deploy traderpulse-backend --source . --platform managed --region us-central1 --allow-unauthenticated"