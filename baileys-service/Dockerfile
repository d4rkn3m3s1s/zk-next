FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create directory for auth files (Volume mount point)
RUN mkdir -p /app/baileys_auth_info

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "run", "prod"]
