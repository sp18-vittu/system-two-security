#!/bin/bash
BASE_DIR=/apps/webapp-service

BRANCH=[branchName]

WEBAPP_PORT=[webappPort]

ACCOUNT_ID=$(aws sts get-caller-identity | jq -r .Account)
echo "ACCOUNT ID ::: ${ACCOUNT_ID}"
REGION=us-east-1
DOCKER_REGISTRY=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
TAG=latest

WEBAPP_IMG_LOC=${DOCKER_REGISTRY}/webapp-${BRANCH}:${TAG}

sed -i "s|\"\[WEBAPP-IMG-LOCATION\]\"|${WEBAPP_IMG_LOC}|g" ${BASE_DIR}/scripts/docker-compose.yml
sed -i "s/\"\[WEBAPP-PORT\]:\[WEBAPP-PORT\]\"/${WEBAPP_PORT}:${WEBAPP_PORT}/g" ${BASE_DIR}/scripts/docker-compose.yml

#Login to ECR
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin $DOCKER_REGISTRY

docker-compose -f ${BASE_DIR}/scripts/docker-compose.yml stop
docker-compose -f ${BASE_DIR}/scripts/docker-compose.yml down --rmi all
docker-compose -f ${BASE_DIR}/scripts/docker-compose.yml rm -f

docker kill webapp
docker container rm webapp

docker-compose -f ${BASE_DIR}/scripts/docker-compose.yml pull
docker-compose -f ${BASE_DIR}/scripts/docker-compose.yml up --detach
