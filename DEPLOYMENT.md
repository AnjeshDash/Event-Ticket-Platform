# Deployment Guide

## Keycloak Deployment on Render

### Step 1: Deploy Keycloak
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `keycloak-auth`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile.keycloak`
   - **Plan**: Free (or choose your preferred plan)
   - **Region**: Ohio (or your preferred region)

### Step 2: Set Environment Variables
In Render dashboard, add these environment variables:
```
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=Anjesh@123
KC_DB=postgres
KC_HOSTNAME=your-render-url.onrender.com
KC_PROXY=edge
KC_HTTP_ENABLED=true
KC_HTTP_PORT=8080
```

### Step 3: Get Keycloak URL
After deployment, Render will provide a URL like:
`https://keycloak-auth-xxxx.onrender.com`

### Step 4: Configure Keycloak Realm
1. Access Keycloak admin console: `https://your-keycloak-url/admin`
2. Login with admin credentials
3. Create a new realm called `event-ticket-platform`
4. Create clients for your application
5. Configure roles and users

### Step 5: Update Application Configuration
Update your application's environment variables:
```
KEYCLOAK_ISSUER_URI=https://your-keycloak-url/realms/event-ticket-platform
```

## Database Setup
For production, you'll need a PostgreSQL database. You can use:
- Render's PostgreSQL service
- Supabase
- AWS RDS
- Any other PostgreSQL provider

Set these environment variables:
```
DATABASE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
```

## Frontend Deployment
For the frontend, you can deploy to:
- Vercel
- Netlify
- Render (Static Site)
- GitHub Pages

Make sure to update the API URLs in your frontend to point to your deployed backend.