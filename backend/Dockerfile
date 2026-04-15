# Use Python 3.12 for building dependencies
FROM python:3.12 AS builder

# Set working directory
WORKDIR /app

# Install system dependencies for building
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final stage: slim image
FROM python:3.12-slim

# Create a non-root user
RUN useradd --create-home --shell /bin/bash app

# Set working directory
WORKDIR /home/app

# Copy installed packages from builder
COPY --from=builder /root/.local /home/app/.local

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R app:app /home/app

# Switch to non-root user
USER app

# Add local bin to PATH
ENV PATH=/home/app/.local/bin:$PATH

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]