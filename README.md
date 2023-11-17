# Dockerized Node.js & Redis Application

## Project Overview

This project is a Dockerized Node.js application that uses Redis for managing visit counts. It demonstrates the integration of Node.js with Redis within a Docker environment, showcasing best practices in containerization and application design.

### Key Features
- **Node.js Backend:** A lightweight and efficient server using Express.js.
- **Redis Integration:** Utilizes Redis as a database to store visit counts.
- **Docker Support:** Containerized with Docker for easy deployment and scaling.
- **TypeScript Support:** Leveraging TypeScript for improved code reliability and maintainability.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/) (for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nawodyaishan/docker-nodejs.git
   cd docker-nodejs
   ```

2. **Build the Docker image**

   ```bash
   docker build -t docker-nodejs .
   ```

3. **Run the Docker container**

   ```bash
   docker run -p 3000:3000 docker-nodejs
   ```

   This will start the application and expose it on `http://localhost:3000`.

## Application Structure

- `Dockerfile`: Contains the Docker configuration for building the image.
- `package.json`: Lists the project dependencies and scripts.
- `pnpm-lock.yaml`: Lock file to ensure consistent installation of dependencies.
- `src/index.ts`: The main server file written in TypeScript.
- `tsconfig.json`: TypeScript compiler configuration.

## Dockerfile Explained

```Dockerfile
# Use a specific version of Node.js on Alpine Linux as the base image
FROM node:18-alpine3.17

# Set environment variables for PNPM's installation location and update PATH
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"

# Enable Corepack for managing package managers like pnpm
RUN corepack enable

# Set the working directory in the container
WORKDIR '/app'

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application's code
COPY . .

# Command to run the application
CMD ["pnpm","start"]
```

## Using the Application

Once the application is running, visit `http://localhost:3000` in your browser. Each visit will increment and display a visit count, stored and retrieved from Redis.


