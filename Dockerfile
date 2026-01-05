FROM node:20-bullseye

WORKDIR /app

# Install Python for backend
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY backend/requirements.txt backend/requirements.txt
COPY frontend/package*.json frontend/

# Install backend dependencies
RUN python3 -m pip install --no-cache-dir -r backend/requirements.txt

# Install frontend dependencies
RUN cd frontend && npm ci

# Copy application source
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Default ports (Railway typically sets PORT=8080)
ENV PORT=8080
ENV BACKEND_PORT=8000

# Expose frontend port (match default PORT)
EXPOSE 8080

# Entry script runs both backend and frontend
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
