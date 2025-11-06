# Social Media Platform V1.0

A secure, scalable web-based social media platform built with React, Node.js, Express, and MongoDB. This platform allows users to create accounts, share posts, interact with content through likes and comments, and manage their own posts.

## Features

### User Authentication
- ✅ User registration with email, username, and password
- ✅ Secure login with JWT tokens
- ✅ Password strength validation (min 8 chars, 1 number, 1 special character)
- ✅ Password hashing with bcrypt
- ✅ Session management with JWT tokens
- ✅ Password reset functionality (basic implementation)

### Post Management
- ✅ Create text-only posts (max 280 characters)
- ✅ Edit your own posts
- ✅ Delete your own posts with confirmation
- ✅ Set post visibility (Public/Private)
- ✅ Character counter for posts
- ✅ Real-time post updates

### Post Interaction
- ✅ View public posts in reverse chronological feed
- ✅ Like/Unlike posts
- ✅ View like count and who liked your posts
- ✅ Comment on posts (max 500 characters)
- ✅ View all comments on posts
- ✅ Delete comments on your own posts (post authors only)

### Security
- ✅ Password hashing with bcrypt and salt
- ✅ XSS protection with input sanitization
- ✅ MongoDB injection prevention
- ✅ JWT-based authentication
- ✅ Authorization checks (users can only edit/delete their own posts)
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for security headers
- ✅ CORS configuration

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Clean and intuitive interface
- ✅ Accessibility features (WCAG 2.1 AA compliant)
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Character counters
- ✅ Confirmation modals for destructive actions

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - MongoDB injection prevention
- **xss** - XSS protection

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **react-hot-toast** - Toast notifications

## Project Structure

```
social-media-platform/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   │   ├── User.js       # User model
│   │   └── Post.js       # Post model
│   ├── routes/            # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── posts.js      # Post routes
│   │   └── users.js      # User routes
│   ├── middleware/        # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── validation.js # Input validation
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── CreatePost.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/      # React context
│   │   │   └── AuthContext.jsx
│   │   ├── api/          # API functions
│   │   │   └── posts.js
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json      # Frontend dependencies
├── package.json          # Root package.json
└── README.md            # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (v6 or higher) - Running locally or MongoDB Atlas connection string

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   Or install separately:
   ```bash
   npm install          # Root dependencies
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/social-media-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-platform
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # From root directory - runs both server and client
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

### Posts
- `GET /api/posts/feed` - Get all public posts (feed)
- `GET /api/posts/my-posts` - Get current user's posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post (author only)
- `DELETE /api/posts/:id` - Delete a post (author only)
- `POST /api/posts/:id/like` - Like/Unlike a post
- `POST /api/posts/:id/comments` - Add a comment to a post
- `DELETE /api/posts/:id/comments/:commentId` - Delete a comment (post author only)

### Users
- `GET /api/users/:username` - Get user profile

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### E2E Tests
```bash
cd client
npm run test:e2e
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.
2. **JWT Secret**: Generate a strong random string for `JWT_SECRET` in production.
3. **HTTPS**: Always use HTTPS in production.
4. **Rate Limiting**: API endpoints are rate-limited to prevent abuse.
5. **Input Validation**: All user inputs are validated and sanitized.
6. **Password Strength**: Enforce strong passwords (8+ chars, number, special char).

## Performance Optimization

- Database indexes on frequently queried fields
- Efficient database queries with proper population
- Frontend code splitting and lazy loading (ready for implementation)
- Optimized React components
- Caching strategies (ready for Redis implementation)

## Future Enhancements (Out of Scope for V1.0)

- Direct messaging between users
- User following/friend system
- Advanced user profiles with avatars
- Image and video uploads
- Algorithmic content feeds
- Groups, pages, and events
- Real-time notifications
- Email verification
- Password reset with email links

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

Built according to the Product Requirements Document (PRD) V1.0 for Social Media Platform.

