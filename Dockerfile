# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create a startup script that handles Render's PORT environment variable
COPY <<EOF /start-app.sh
#!/bin/sh
PORT=\${PORT:-8080}
echo "Starting Spring Boot application on port \$PORT"
exec java -jar app.jar --server.port=\$PORT
EOF

RUN chmod +x /start-app.sh

EXPOSE 8080
ENTRYPOINT ["/start-app.sh"]
