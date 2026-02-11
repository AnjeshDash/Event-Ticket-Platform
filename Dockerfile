# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Use CMD directly with shell to handle PORT environment variable
CMD ["sh", "-c", "PORT=${PORT:-8080} && echo \"Starting Spring Boot application on port $PORT\" && exec java -jar app.jar --server.port=$PORT"]

EXPOSE 8080
