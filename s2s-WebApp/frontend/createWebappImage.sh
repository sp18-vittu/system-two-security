#!/bin/bash
BRANCH=$1
WEBAPP_PORT=$2

ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account')
echo "ACCOUNT ID ::: ${ACCOUNT_ID}"
REGION=us-east-1
DOCKER_REGISTRY=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
IMAGE_NAME=s2s/webapp
WEBAPP_REPO=${IMAGE_NAME}

sed -i "s/\[webappPort\]/${WEBAPP_PORT}/g" nginx.conf
#Login to ECR
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin $DOCKER_REGISTRY

aws ecr describe-repository --repository-names ${WEBAPP_REPO} || aws ecr create-repository --repository-name ${WEBAPP_REPO}

#bulld the nginx image
docker build --build-arg BRANCH=${BRANCH} . --label "cname=${IMAGE_NAME}" -t ${DOCKER_REGISTRY}/${WEBAPP_REPO}:latest

docker push ${DOCKER_REGISTRY}/${WEBAPP_REPO}:latest

echo "Finished Building Webapp Image and pushed to ${DOCKER_REGISTRY}/${WEBAPP_REPO}:latest"
