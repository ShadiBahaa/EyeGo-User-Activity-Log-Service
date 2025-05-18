# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Copy wait-for-it script and make it executable
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Install nodemon globally for development hot-reload
RUN npm install -g nodemon

# Expose the port (default 3000)
EXPOSE 3000

# Set environment variables (can be overridden by docker-compose or runtime)
ENV NODE_ENV=development

# Start the application with wait-for-it script and nodemon for live reload
CMD ["./wait-for-it.sh", "mongo:27017", "-t", "60", "--", "./wait-for-it.sh", "kafka:9092", "-t", "60", "--", "nodemon", "src/server.js"]

