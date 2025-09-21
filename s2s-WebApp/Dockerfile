# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++ libcap

# Install pnpm globally
RUN npm install -g pnpm

# Install serve package globally
RUN npm install -g serve

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY package.json pnpm-lock.yaml ./

# Copy the rest of the application code to the working directory
COPY . .

# Move to frontend folder
RUN cd frontend

# Install dependencies using pnpm

RUN pnpm install 

# Generate build
RUN pnpm run build

# Define the command to run your application

CMD ["serve", "-s", "frontend/dist", "-l", "3001"]
