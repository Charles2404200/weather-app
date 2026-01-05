FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose default port (Railway will map its own $PORT)
EXPOSE 3000

# Run the application
# Use $PORT from environment if provided (Railway), default to 3000
CMD ["sh", "-c", "echo Using PORT=${PORT:-3000}; npm start -- -p ${PORT:-3000}"]
