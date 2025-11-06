# Quick Start Guide

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (running locally or MongoDB Atlas)

## Installation Steps

1. **Install all dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   - Create `server/.env` file:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/social-media-platform
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     FRONTEND_URL=http://localhost:5173
     ```

3. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```
   This starts both the backend (port 5000) and frontend (port 5173)

5. **Access the application**
   - Open http://localhost:5173 in your browser
   - Register a new account
   - Start creating posts!

## Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `server/.env`
- For MongoDB Atlas, use the connection string format:
  `mongodb+srv://username:password@cluster.mongodb.net/social-media-platform`

### Port Already in Use
- Change `PORT` in `server/.env` for backend
- Change port in `client/vite.config.js` for frontend

### CORS Issues
- Ensure `FRONTEND_URL` in `server/.env` matches your frontend URL
- Default is `http://localhost:5173`

## Development

### Running Backend Only
```bash
cd server
npm run dev
```

### Running Frontend Only
```bash
cd client
npm run dev
```

## Production Build

```bash
# Build frontend
cd client
npm run build

# The built files will be in client/dist/
```

