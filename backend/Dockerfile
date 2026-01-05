FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose default port (Railway will map its own $PORT)
EXPOSE 8080

# Run the application
# Use $PORT from environment if provided (Railway), default to 8080
CMD ["sh", "-c", "echo Using PORT=${PORT:-8080}; uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
