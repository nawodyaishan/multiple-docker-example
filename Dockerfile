# Use a specific version of node on Alpine Linux as the base image
FROM node:18-alpine3.17

# Set environment variables for PNPM's installation location and update PATH
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"

# Enable Corepack to manage package managers like pnpm, yarn, etc.
RUN corepack enable

# Set the working directory in the container to /app
WORKDIR '/app'

# Copy package.json and pnpm-lock.yaml into the container's working directory
COPY package.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application's code into the container
COPY . .

# Define the command to run the application when the container starts
CMD ["pnpm","start"]
