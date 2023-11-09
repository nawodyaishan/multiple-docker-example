# Creating Docker File

A `Dockerfile` is a script used by Docker to automate the building of container images. It contains a set of instructions that specify the base image and the steps required to configure the environment and deploy your application within a container. Here's a breakdown of the common components and instructions you might find in a `Dockerfile`:

1. **Base Image**: Specifies the starting point for the build process.
    - `FROM`: Sets the base image. For example, `FROM ubuntu:20.04` starts with an Ubuntu 20.04 image.
2. **Maintainer Information**:
    - `LABEL`: Provides metadata like maintainer information. For example, `LABEL maintainer="name@example.com"`.
3. **Run Commands**:
    - `RUN`: Executes a command during the image build process. For example, `RUN apt-get update`.
4. **Environment Variables**:
    - `ENV`: Sets environment variables. For example, `ENV MY_VARIABLE=value`.
5. **Working Directory**:
    - `WORKDIR`: Sets the working directory for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, and `ADD` instructions that follow in the `Dockerfile`.
6. **Expose Ports**:
    - `EXPOSE`: Informs Docker that the container listens on the specified network ports at runtime.
7. **Copy Files/Folders**:
    - `COPY`: Copies new files or directories from the source (local machine) to the container's filesystem at the specified path.
    - `ADD`: Similar to `COPY`, but can also fetch remote URLs and extract tarball content.
8. **Volume Mounting**:
    - `VOLUME`: Creates a mount point for externally mounted volumes or other containers.
9. **Default Command**:
    - `CMD`: Provides defaults for executing the container. There can only be one `CMD` in a `Dockerfile`. If multiple are specified, the last one takes effect.
10. **Entrypoint**:
- `ENTRYPOINT`: Configures the container to run as an executable. It allows you to set a default application to be used every time a container is created with the image.
    1. **User Setting**:
        - `USER`: Sets the username or UID and optionally the user group or GID to use when running the image.
    2. **Healthcheck**:
        - `HEALTHCHECK`: Tells Docker how to test the container to check that it's still working.
    3. **Stop Signal**:
        - `STOPSIGNAL`: Sets the system call signal that will be sent to the container to exit.
    4. **Comments**:
        - Lines starting with `#` are treated as comments and are ignored during the build process.

Here's a simple example of a `Dockerfile` for a Node.js application:
![Untitled](https://github.com/nawodyaishan/multiple-docker-example/assets/50957846/d9569e1d-07e0-4e83-8b0a-2a5566f05e36)


```docker
# Use the official Node.js v14 image as the base image.
FROM node:14

# Set the working directory inside the container to '/app'.
WORKDIR /app

# Copy the 'package.json' and 'yarn.lock' files from the current directory on the host to the '/app' directory in the container.
COPY package.json yarn.lock ./

# Run the 'yarn install' command inside the container to install the application's dependencies.
RUN yarn install

# Copy the rest of the application source code from the current directory on the host to the '/app' directory in the container.
COPY . .

# Set an environment variable named 'PORT' with the value '8080' inside the container.
ENV PORT=8080

# Inform Docker that the container will listen on port 8080 at runtime.
EXPOSE 8080

# Define the default command to run the application using Yarn when the container starts.
CMD ["yarn", "start"]
```

Here's a brief explanation of each line:

1. **`FROM node:14`**: This specifies that the base image for this Docker container will be the official Node.js version 14 image.
2. **`WORKDIR /app`**: This sets the working directory inside the container. All subsequent commands will be run from this directory.
3. **`COPY package.json yarn.lock ./`**: This copies the **`package.json`** and **`yarn.lock`** files from your local directory (where you're running the Docker command) into the container's **`/app`** directory.
4. **`RUN yarn install`**: This installs the Node.js dependencies for your application inside the container using Yarn.
5. **`COPY . .`**: This copies the rest of your application's source code into the container.
6. **`ENV PORT=8080`**: This sets an environment variable inside the container, which your application can use to determine which port to listen on.
7. **`EXPOSE 8080`**: This tells Docker that the container will be listening on port 8080. This doesn't actually publish the port; it's more of a documentation feature.
8. **`CMD ["yarn", "start"]`**: This is the command that will be run by default when you start a container from this image. In this case, it will start your Node.js application using Yarn.

This Dockerfile provides a blueprint for Docker to build an image of your Node.js application, which can then be run inside a container.

---

# **Building the Docker Image**

This section describes how to build a Docker image from a Dockerfile.

**Command:**

```docker
docker build -t <name>/<name for image>:<version> .
```

**Explanation:**

- `docker build`: This is the Docker command used to build an image from a Dockerfile.
- `t`: This flag allows you to tag the image with a name and optionally a version (or tag). It's a way to give a human-readable name to the image you're building.
- `<name>/<name for image>:<version>`: This is the name and tag you're giving to the image.
    - `<name>`: Typically, this is your Docker Hub username or organization name.
    - `<name for image>`: This is the name you want to give to your Docker image.
    - `<version>`: This is the version or tag for the image. For example, `1.0`.
- `.`: This indicates that the Docker build context is the current directory. Docker will look for a file named `Dockerfile` in this directory.

For example, if your Docker Hub username is `john` and you're building an image for a project named `myapp` with version `1.0`, the command would be:

```docker
docker build -t john/myapp:1.0 .
```

---

# **The Container**

This section describes how to run a container from the Docker image you've built.

**Command:**

```docker
docker run -p <port>:<port> <name>/<name for image>:<version>
```

**Explanation:**

- `docker run`: This is the Docker command used to create and start a container from an image.
    
    
- `p <port>:<port>`: This flag maps a network port on the host to a port in the container.
    - The first `<port>` is the host's port, and the second `<port>` is the container's port. For example, `p 8080:8080` would map port 8080 on the host to port 8080 on the container.
- `<name>/<name for image>:<version>`: This is the name and tag of the image you want to run. It should match the name and tag you used when building the image.

For example, to run the `myapp` image version `1.0` that you built in the previous step and map its port 8080 to the host's port 8080, the command would be:

```docker
docker run -p 8080:8080 john/myapp:1.0
```

## **Docker Run Command**

The `docker run` command is a combination of `create` and `start`. It creates a new container from a specified image and starts it immediately.

**Example:**

```bash
docker run -d -p 80:80 myapp
```

- `d`: Runs the container in detached mode, meaning the container runs in the background.
- `p 80:80`: Maps port 80 of the host to port 80 of the container.
- `myapp`: The name of the image to create the container from.

In the diagram, the user issues the `docker run` command via the Docker CLI. The CLI sends the command to the Docker Daemon, which then creates and starts the container. The container is now running in the background.

### **Docker Create Command**

The `docker create` command creates a new container but does not start it. It's useful when you want to set up a container in advance and start it later.

**Example:**

```bash
docker create myapp
```

- `myapp`: The name of the image to create the container from.

In the sequence, after the `docker create` command is issued, the Docker Daemon creates the container. The container is created but remains stopped.

### **Docker Start Command**

The `docker start` command is used to start a stopped container.

**Example:**

```bash
docker start -a myapp
```

- `a`: Attaches the terminal to the container's output, allowing you to interact with it or see its output.
- `myapp`: The name of the container to start.

Following the `docker start` command in the diagram, the Docker Daemon starts the specified container. If the `-a` flag is used, the user's terminal is attached to the container's output, allowing the user to interact with the container or see its output in real-time.

### **Putting It All Together**

These commands are part of the Docker workflow for managing the lifecycle of containers. You create a container with `docker create`, start it with `docker start`, and run a container directly with `docker run`. The `-d` and `-a` flags control whether the container runs in the background or attaches to the terminal, respectively.

Understanding these commands and options is fundamental for anyone working with Docker, as they provide control over how containers are initialized and interacted with.
