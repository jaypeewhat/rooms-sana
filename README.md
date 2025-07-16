# Hotel Room Management Backend

A Node.js/Express backend API for hotel room management with multi-user synchronization.

## Features

- **Room Management**: Full CRUD operations for rooms
- **Role-Based Access**: Admin and student permissions
- **Multi-User Sync**: Real-time synchronization across devices
- **Work Submissions**: Educational work submission system
- **Offline Support**: Works offline with automatic sync when back online

## API Endpoints

### Room Management
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Add new room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)
- `PATCH /api/rooms/:id/status` - Update room status (admin + student)

### Work Submissions
- `POST /api/submissions` - Submit work
- `GET /api/submissions` - Get all submissions

### System
- `GET /` - API information
- `GET /health` - Health check

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Database

Uses SQLite in-memory database with the following tables:
- `rooms` - Room information and status
- `work_submissions` - Educational work submissions

## Sample Data

The server includes 3 sample rooms:
- Room 101 (Standard, Available, ₱2,500)
- Room 102 (Deluxe, Occupied, ₱3,500)
- Room 201 (Suite, Dirty, ₱5,000)

## Role-Based Permissions

### Admin
- Can add, edit, and delete rooms
- Can update room status
- Full access to all endpoints

### Student
- Can only update room status
- Cannot add, edit, or delete rooms

## Deployment

This backend is designed to be deployed on platforms like:
- Render
- Heroku
- Railway
- Vercel

## Frontend Integration

Works with the Hotel Management frontend that includes:
- React room management components
- Offline synchronization
- Role-based UI permissions

## License

MIT
