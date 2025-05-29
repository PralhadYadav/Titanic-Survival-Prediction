# Stage 1: Build the Node.js application
FROM node:20-slim AS build

WORKDIR /app/api

COPY package*.json ./

RUN npm install

COPY . .

# Build the TypeScript code

RUN npm run build

# Stage 2: Create the production image
FROM node:20-slim

# Update and install security patches
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app/api

# Copy only the necessary files from the build stage
COPY --from=build /app/api/dist ./dist
COPY --from=build /app/api/node_modules ./node_modules
COPY --from=build /app/api/package.json ./package.json
COPY --from=build /app/api/requirements.txt ./requirements.txt
COPY --from=build /app/api/src/models /app/api/dist/models

# Install Python and pip, and then the Python dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

# Create a virtual environment for Python dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]