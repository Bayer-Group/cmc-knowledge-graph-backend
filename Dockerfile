FROM node:10-alpine as build-phase

# Set environment variables
ENV PORT=8080
ENV NODE_ENV="docker"

# Create application directory
RUN mkdir -p /ng-app
WORKDIR /ng-app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy application code
COPY . .

# Compile TypeScript files
RUN npm run tsc

# Expose the desired port
EXPOSE 8080

# Start the application with NODE_ENV set to 'docker'
CMD ["sh", "-c", "NODE_ENV=docker node dist/src/app.js"]
