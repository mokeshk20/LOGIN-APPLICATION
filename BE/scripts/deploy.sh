#!/bin/bash

# This script assumes you have AWS CLI configured

# Get AWS account ID, region, and repository name from environment variables
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?AWS_ACCOUNT_ID not set}"
AWS_REGION="${AWS_REGION:?AWS_REGION not set}"
REPO_NAME="${REPO_NAME:?REPO_NAME not set}"
APP_NAME="your-app-name" # setting a default app name

# Build Docker image
docker build -t $APP_NAME .

# Tag the image for ECR
docker tag $APP_NAME:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest"

# Authenticate Docker with ECR
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Push the image to ECR
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest"

echo "Deployment complete!"