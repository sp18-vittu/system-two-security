# syntax=docker/dockerfile:1.4
# Fetching the latest nginx image
FROM amazonlinux

RUN yum install -y nginx
# For AWS Amplify
RUN yum update && yum install -y sudo
RUN yum install -y glibc
RUN yum install -y git
RUN yum install -y openssh
RUN yum install -y bash
RUN yum install -y nodejs
RUN yum install -y npm
RUN yum install -y wget
RUN yum install -y tar



# Setting up the work directory
WORKDIR /app

RUN echo $(ls -1 /app/)

# Copying built assets from builder
COPY dist /usr/share/nginx/html
COPY status.html /usr/share/nginx/html
RUN echo $(ls -1 /app/)

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf