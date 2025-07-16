const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:'); // Use in-memory database for simplicity

// Create tables
db.serialize(() => {
  // Work submissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS work_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      work_type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      roomNumber TEXT NOT NULL UNIQUE,
      roomType TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      floor INTEGER,
      capacity INTEGER DEFAULT 2,
      description TEXT,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL
    )
  `);

  // Insert sample rooms
  const sampleRooms = [
    {
      id: 'room_1',
      roomNumber: '101',
      roomType: 'standard',
      price: 2500.00,
      status: 'available',
      floor: 1,
      capacity: 2,
      description: 'Standard room with garden view',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    },
    {
      id: 'room_2',
      roomNumber: '102',
      roomType: 'deluxe',
      price: 3500.00,
      status: 'occupied',
      floor: 1,
      capacity: 2,
      description: 'Deluxe room with city view',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    },
    {
      id: 'room_3',
      roomNumber: '201',
      roomType: 'suite',
      price: 5000.00,
      status: 'dirty',
      floor: 2,
      capacity: 4,
      description: 'Executive suite with balcony',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    }
  ];

  sampleRooms.forEach(room => {
    db.run(
      `INSERT OR IGNORE INTO rooms (id, roomNumber, roomType, price, status, floor, capacity, description, createdAt, createdBy, updatedAt, updatedBy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room.id,
        room.roomNumber,
        room.roomType,
        room.price,
        room.status,
        room.floor,
        room.capacity,
        room.description,
        room.createdAt,
        room.createdBy,
        room.updatedAt,
        room.updatedBy
      ]
    );
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Room Management Backend API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      submissions: '/api/submissions',
      rooms: '/api/rooms'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Work submission endpoints
app.post('/api/submissions', (req, res) => {
  const { studentName, workType, content } = req.body;

  if (!studentName || !workType || !content) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: studentName, workType, content' 
    });
  }

  const submissionDate = new Date().toISOString();
  const createdAt = new Date().toISOString();

  db.run(
    'INSERT INTO work_submissions (student_name, submission_date, work_type, content, created_at) VALUES (?, ?, ?, ?, ?)',
    [studentName, submissionDate, workType, content, createdAt],
    function(err) {
      if (err) {
        console.error('Error inserting submission:', err);
        return res.status(500).json({ success: false, error: 'Failed to save submission' });
      }

      res.json({
        success: true,
        id: this.lastID,
        message: 'Work submission saved successfully'
      });
    }
  );
});

app.get('/api/submissions', (req, res) => {
  db.all('SELECT * FROM work_submissions ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching submissions:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
    }

    res.json({ success: true, data: rows });
  });
});

// Room Management Endpoints
app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms ORDER BY roomNumber', (err, rows) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch rooms' });
    }

    res.json({ success: true, data: rows });
  });
});

app.post('/api/rooms', (req, res) => {
  const { room, user } = req.body;
  
  // Validate admin permission
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }

  // Insert room into database
  db.run(
    `INSERT INTO rooms (id, roomNumber, roomType, price, status, floor, capacity, description, createdAt, createdBy, updatedAt, updatedBy) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      room.id,
      room.roomNumber,
      room.roomType,
      room.price,
      room.status,
      room.floor,
      room.capacity,
      room.description,
      room.createdAt,
      room.createdBy,
      room.updatedAt,
      room.createdBy
    ],
    function(err) {
      if (err) {
        console.error('Error adding room:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, error: 'Room number already exists' });
        }
        return res.status(500).json({ success: false, error: 'Failed to add room' });
      }

      res.json({ success: true, data: room });
    }
  );
});

app.put('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const { updates, user } = req.body;
  
  // Validate admin permission
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }

  // Update room in database
  db.run(
    `UPDATE rooms SET roomNumber = ?, roomType = ?, price = ?, status = ?, floor = ?, capacity = ?, description = ?, updatedAt = ?, updatedBy = ? 
     WHERE id = ?`,
    [
      updates.roomNumber,
      updates.roomType,
      updates.price,
      updates.status,
      updates.floor,
      updates.capacity,
      updates.description,
      updates.updatedAt,
      updates.updatedBy,
      id
    ],
    function(err) {
      if (err) {
        console.error('Error updating room:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, error: 'Room number already exists' });
        }
        return res.status(500).json({ success: false, error: 'Failed to update room' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }

      res.json({ success: true, data: updates });
    }
  );
});

app.delete('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  
  // Validate admin permission
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }

  // Delete room from database
  db.run('DELETE FROM rooms WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting room:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete room' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({ success: true });
  });
});

app.patch('/api/rooms/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, user } = req.body;
  
  // Validate permission (both admin and student can update status)
  if (!user || (user.role !== 'admin' && user.role !== 'student')) {
    return res.status(403).json({ success: false, error: 'Permission required' });
  }

  // Update room status in database
  db.run(
    'UPDATE rooms SET status = ?, updatedAt = ?, updatedBy = ? WHERE id = ?',
    [
      status,
      new Date().toISOString(),
      user.email,
      id
    ],
    function(err) {
      if (err) {
        console.error('Error updating room status:', err);
        return res.status(500).json({ success: false, error: 'Failed to update room status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }

      res.json({ success: true, data: { status, updatedAt: new Date().toISOString() } });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Hotel Room Management Backend running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🏨 Available endpoints:`);
  console.log(`  GET  /               - API information`);
  console.log(`  GET  /health         - Health check`);
  console.log(`  POST /api/submissions - Submit work`);
  console.log(`  GET  /api/submissions - Get submissions`);
  console.log(`  GET  /api/rooms      - Get all rooms`);
  console.log(`  POST /api/rooms      - Add new room (admin)`);
  console.log(`  PUT  /api/rooms/:id  - Update room (admin)`);
  console.log(`  DELETE /api/rooms/:id - Delete room (admin)`);
  console.log(`  PATCH /api/rooms/:id/status - Update room status`);
  console.log(`🎯 Ready for multi-user room management!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;
