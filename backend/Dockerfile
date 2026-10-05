# ==========================================
# KaamSetu Backend Dockerfile
# Production-ready Node.js container
# ==========================================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./

RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Environment variables with sensible defaults
ENV NODE_ENV=production \
    PORT=5000

# Run backend service
CMD ["node", "server.js"]
