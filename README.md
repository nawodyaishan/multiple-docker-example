# Project Overview

This project is a Dockerized Node.js application that uses Redis for managing visit counts. It demonstrates the integration of Node.js with Redis within a Docker environment, showcasing best practices in containerization and application design.

### Key Features

- **Node.js Backend:** A lightweight and efficient server using Express.js.
- **Redis Integration:** Utilizes Redis as a database to store visit counts.
- **Docker Support:** Containerized with Docker for easy deployment and scaling.
- **TypeScript Support:** Leveraging TypeScript for improved code reliability and maintainability.

# Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/) (for local development)

### Installation

1. **Clone the repository**

    ```bash
    git clone <https://github.com/nawodyaishan/docker-nodejs.git>
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

```yaml
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

# Running Redis Image

### Prerequisites

- Ensure you have [Docker installed](https://www.docker.com/products/docker-desktop) on your machine.

### Steps to Run Redis Image

1. **Pull the Redis Image**

   First, you need to pull the official Redis image from Docker Hub. Open a terminal or command prompt and run the
   following command:

    ```bash
    docker pull redis
    ```

   This command downloads the latest Redis image to your local machine.

2. **Run the Redis Container**

   After pulling the image, you can start a Redis container. Run the following command:

    ```bash
    docker run --name my-redis -p 6379:6379 -d redis
    ```

   Here’s what each part of this command does:

    - `-name my-redis`: Assigns the name `my-redis` to your Docker container.
    - `p 6379:6379`: Maps port 6379 of the container to port 6379 on your host machine. Redis by default runs on port
      6379.
    - `d`: Runs the container in detached mode, meaning the container runs in the background.
    - `redis`: Specifies the Redis image to use.

   After running this command, Redis will be up and running in a Docker container.

3. **Verify Redis Container is Running**

   You can check if your Redis container is running by executing:

    ```bash
    docker ps
    ```

   This will list all active containers. Look for the `my-redis` container in the list.

4. **Stopping the Redis Container**

   When you're done, you can stop the Redis container by running:

    ```bash
    docker stop my-redis
    ```

5. **Restarting the Redis Container**

   To restart the container, use:

    ```bash
    docker start my-redis
    ```

# Setting Up Networking Infrastructure

## Using Docker Compose

The `docker-compose.yml` defines a multi-container Docker application with two services: a Redis server and a Node.js
application. Below is a detailed explanation of the configuration file and how to use it.

```yaml
version: '3' # Specifies the version of the Docker Compose file format

services: # Defines the services that make up your application

  my-redis: # Name of the first service
    image: 'redis' # Specifies the Redis image from Docker Hub

  node-app: # Name of the second service
    build: . # Builds an image using the Dockerfile in the current directory
    ports:
      - "4001:4001" # Maps port 4001 inside the container to port 4001 on the host
```

### Breakdown of Services

1. **Redis Server:**
    - The service `redis-server` uses the official `redis` image from Docker Hub.
    - No ports are exposed to the host in this configuration, meaning Redis will only be accessible to other services
      within the same Docker network (like your `node-app` service).
2. **Node Application:**
    - The `node-app` service is built using the `Dockerfile` in the current directory (specified by `build: .`).
    - The application inside the container listening on port `8081` will be accessible on port `4001` of your host
      machine.

## Using the Docker Compose File

To use this `docker-compose.yml` file, follow these steps:

### Steps to Run

1. **Navigate to the Project Directory:**

   Ensure you are in the directory where your `docker-compose.yml` file and the `Dockerfile` for your Node.js
   application are located.

2. **Running Docker Compose:**

   Run the following command to build and start your services:

    ```bash
    docker-compose up --build
    ```

   This command builds the Node.js application image (as per your Dockerfile), starts the Redis service, and starts the
   Node.js application service.

    - **Building Service Images:** Docker Compose looks at the **`services`** defined in your **`docker-compose.yml`**
      file. For services that specify a build context (using the **`build`** key), Docker Compose uses the corresponding
      **`Dockerfile`** to build a Docker image for each of these services.
    - **The `-build` Flag:** This flag forces Docker Compose to build (or rebuild) the images for the services, even if
      an image already exists. It's useful when you have made changes to a service or its Dockerfile and want to ensure
      that the latest version is used.
3. **Accessing the Application:**

   Your Node.js application should now be accessible at `http://localhost:4001`.

4. **Shutting Down:**

   To stop and remove the containers, networks, and volumes created by `up`, run:

    ```bash
    docker-compose down
    ```

### Additional Notes

- **Data Persistence for Redis:** If you need to persist Redis data, consider defining a volume for the Redis service in
  your `docker-compose.yml`.
- **Environment Variables:** If your Node.js application requires environment variables, you can define them in
  the `docker-compose.yml` file under the `node-app` service using the `environment` key or using an `.env` file.
- **Custom Redis Configuration:** To use a custom Redis configuration, you can mount a configuration file from your host
  to the Redis container.

Using Docker Compose simplifies the management of multi-container Docker applications, making it easy to start, stop,
and rebuild services in a coordinated manner.

# Networking in Docker Compose

1. **Automatic Network Creation:**
    - When you run `docker-compose up`, Docker Compose automatically creates a network for your services. By default,
      this network allows communication between the containers.
2. **Service Name as Hostname:**
    - In your `docker-compose.yml`, the services are named `redis-server` and `node-app`. These service names can be
      used as hostnames within the network. For example, your Node.js app can access the Redis server using the
      hostname `redis-server`.

### Connecting Node App to Redis Server

In your Node.js application, when configuring the Redis client, you should use `redis-server` as the hostname to connect
to the Redis server. Here's an example based on your provided `index.ts` file:

```tsx
// ... other imports
import {createClient} from 'redis';

// Create a Redis client using the service name as the hostname
const client: RedisClientType = createClient({
    url: 'redis://my-redis:6379'
});

// ... rest of your code

```

### Explanation

- `redis://redis-server:6379`: This tells the Redis client to connect to the Redis server at the
  hostname `redis-server`, which is the name of your Redis service in `docker-compose.yml`, on the default Redis port
  6379.

### Benefits

- **Isolation:** Each service runs in its own container, providing an isolated environment.
- **Scalability:** Services can be scaled independently.
- **Service Discovery:** Docker Compose network handles service discovery automatically, allowing services to
  communicate by their names.

# Initiating a multi-containers

Running the command `docker-compose up --build` initiates a multi-step process involving both building Docker images for
your services (if necessary) and then starting those services as defined in your `docker-compose.yml` file. Let's break
down what happens when you execute this command:

### 1. Building Images

- **Building Service Images:**
    - Docker Compose looks at the services defined in your `docker-compose.yml` file.
    - For services that require building an image (like your `node-app` service which has a `build: .` directive),
      Docker Compose uses the corresponding `Dockerfile` in the specified context (in your case, the current
      directory `.`) to build a Docker image.
    - The `-build` flag forces Docker Compose to build (or rebuild) the images for the services even if an image already
      exists. This ensures that any changes in the service’s Dockerfile or in the service’s build context are included.

### 2. Creating and Starting Containers

- **Creating Redis Server Container:**
    - For the `redis-server` service, since it uses an image directly (`image: 'redis'`), Docker Compose pulls the Redis
      image from Docker Hub if it's not already available locally.
    - Docker Compose then creates a new container instance based on the Redis image.
- **Creating Node App Container:**
    - For the `node-app` service, Docker Compose uses the image built in the previous step.
    - A new container instance is created based on this image.

### 3. Setting Up Networking

- **Automatic Network Creation:**
    - Docker Compose sets up a default network for the composed application.
    - Each container is attached to this network, and each service can communicate with other services using the service
      names as hostnames (e.g., `redis-server` for the Redis service).

### 4. Exposing Ports

- **Port Mapping:**
    - For your `node-app` service, Docker Compose maps the port `8081` inside the container to port `4001` on your host
      machine. This makes your Node.js application accessible via `http://localhost:4001`.

### 5. Running Services

- **Starting Services:**
    - Both the `redis-server` and `node-app` containers are started.
    - If there are any dependencies between the services (not in your case), Docker Compose starts the services in
      dependency order.

### 6. Logs and Monitoring

- **Service Logs:**
    - By default, Docker Compose streams the output of all the containers to the terminal. This includes logs that would
      normally output to stdout and stderr.

### 7. Running in the Background

- **Detached Mode (Optional):**
    - If you want to run the services in the background, you can add the `d` flag (`docker-compose up --build -d`). This
      will start the containers in detached mode, and you will get the command prompt back.

# Introduction to Restart Policies

Docker provides several restart policies to control the behavior of containers in different situations:

1. **`no`:** This is the default restart policy. The container will not be restarted if it stops or crashes.
2. **`always`:** The container will always be restarted if it stops. If the container is manually stopped, it is
   restarted only when the Docker daemon restarts or the container itself is manually restarted.
3. **`unless-stopped`:** The container will always be restarted unless it is explicitly stopped. Even if the Docker
   daemon restarts, the container will be restarted unless it was manually stopped before.
4. **`on-failure`:** The container will be restarted only if it exits with a non-zero exit status (indicative of an
   error). Optionally, you can specify a maximum number of retries before giving up.

### Implementation of Restart Policies

To implement restart policies, you specify them when you run a container using the `docker run` command, or you can
define them in a `docker-compose.yml` file for Docker Compose-managed containers.

### Using `docker run`

When you start a container with `docker run`, use the `--restart` flag to set the restart policy. Here are some
examples:

- **No Restart Policy:**

    ```bash
    docker run --restart=no my-image
    ```

- **Always Restart Policy:**

    ```bash
    docker run --restart=always my-image
    ```

- **Restart on Failure with Maximum Retries:**

    ```bash
    docker run --restart=on-failure:5 my-image
    ```

### Using `docker-compose.yml`

In a `docker-compose.yml` file, you can specify the restart policy for each service. Here's an example of how to set
different restart policies:

```yaml
version: '3'
services:
  webapp:
    image: my-webapp
    restart: always

  redis:
    image: redis
    restart: on-failure

  mysql:
    image: mysql
    restart: unless-stopped
```

### Best Practices and Considerations

- **Use Wisely:** Restart policies are helpful for ensuring high availability, but they should be used wisely.
  Automatically restarting a container that is failing due to a configuration error or a fundamental issue can lead to a
  restart loop.
- **Logging and Monitoring:** Implement logging and monitoring to keep track of container restarts and diagnose any
  issues leading to repeated restarts.
- **Health Checks:** Combine restart policies with health checks for more robustness. Docker can check the health of
  your application and restart the container if it becomes unhealthy.
- **Docker Compose in Production:** When using Docker Compose in production, ensure that your restart policies are
  correctly set to handle unexpected failures.

Restart policies are a key feature in Docker for managing container lifecycles, especially in production environments
where reliability is critical. By understanding and implementing these policies correctly, you can significantly improve
the resilience of your Dockerized applications.

# Final Takeaway

### Architecture Overview of the Node.js and Redis Application

### 1. Components

- **Node.js Application (Service: `node-app`):**
    - **Function:** Serves as the web server, handling HTTP requests and responses.
    - **Technology:** Built using Express.js, a popular framework for Node.js.
    - **Primary Role:** Manages the business logic, which in this case, is tracking the number of visits to the
      homepage.
    - **Redis Interaction:** Connects to the Redis server to get and set the visit count.
    - **Port Exposure:** The service is exposed on port 4001, making it accessible via `http://localhost:4001`.
- **Redis Server (Service: `my-redis`):**
    - **Function:** Acts as a data store for the application.
    - **Technology:** An in-memory data structure store, used as a database, cache, and message broker.
    - **Role:** Stores the number of visits as a key-value pair.
    - **Persistence:** By default, Redis data is ephemeral. To persist data, you'd need to configure Redis with a volume
      in Docker.

### 2. Networking

- **Internal Network:**
    - Created and managed by Docker Compose.
    - Both the Node.js application and Redis server are attached to this network.
    - This setup allows the Node.js application to communicate with the Redis server using the service name `my-redis`
      as the hostname.

### 3. Data Flow

1. **HTTP Request Handling:**
    - A user sends an HTTP request to the Node.js application by accessing `http://localhost:4001`.
    - The Express server in the Node.js application receives the request.
2. **Retrieving and Updating Visits:**
    - The Node.js application queries the Redis server to retrieve the current number of visits.
    - The Redis server responds with the visit count.
    - The Node.js application increments this number and sends it back to Redis for updating.
3. **Response to the User:**
    - The Node.js application then sends a response back to the user with the number of visits.

### 4. Docker Compose Configuration

- Defined in a `docker-compose.yml` file.
- Specifies the services (`node-app` and `my-redis`), their configurations, and how they are networked together.
- Ensures that both services can be started, stopped, and managed together, providing a cohesive environment for the
  application.

### 5. Scalability and Reliability

- **Scalability:** The application can be scaled by increasing the number of Node.js instances, assuming the Redis
  server can handle the increased load.
- **Reliability:** Implemented through Docker's restart policies. In case of failures, containers can be automatically
  restarted based on the policy.

### 6. Security Considerations

- **Network Security:** Communication between the Node.js application and Redis server is internal and not exposed to
  the external network.
- **Data Security:** Redis data security needs consideration, especially if sensitive data is stored.
- **Container Security:** Regular updates to the Docker images and secure configuration are necessary to mitigate
  security vulnerabilities.

### Conclusion

The architecture provides a solid foundation for a web application with a Redis backend. It leverages Docker and Docker
Compose for containerization and orchestration, ensuring ease of deployment and scalability. This setup is ideal for
applications requiring high-performance data interactions, with the flexibility to adapt to increasing loads and
complexity.