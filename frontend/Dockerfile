FROM node:18-alpine as builder

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app/frontend

# Install http-server to serve the built app
RUN npm install -g http-server

COPY --from=builder /app/frontend/dist ./dist

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

CMD ["http-server", "dist", "-p", "5173"]

