# Environment Variables Setup

## For Local Development

1. Copy the `.env.example` file to `.env` in the server directory:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - Replace `your_mongodb_connection_string_here` with your MongoDB Atlas connection string
   - Set other variables as needed

## For GitHub Deployment

### Using GitHub Actions/Secrets:
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 5000 (or your preferred port)
   - `NODE_ENV`: production
   - `CLIENT_URL`: Your frontend URL

### Using Render/Heroku/Vercel:
Add these environment variables in your deployment platform's dashboard:
- `MONGODB_URI`
- `PORT`
- `NODE_ENV`
- `CLIENT_URL`

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend application URL for CORS
