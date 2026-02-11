# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create startup script directly with RUN command
RUN echo '#!/bin/sh' > /start-app.sh && \
    echo 'PORT=${PORT:-8080}' >> /start-app.sh && \
    echo 'echo "Starting Spring Boot application on port $PORT"' >> /start-app.sh && \
    echo 'exec java -jar app.jar --server.port=$PORT' >> /start-app.sh && \
    chmod +x /start-app.sh

EXPOSE 8080
ENTRYPOINT ["/start-app.sh"]
