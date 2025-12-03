const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create table
    db.run(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// API Routes

// Get all countries
app.get('/api/countries', (req, res) => {
  db.all('SELECT * FROM countries ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ countries: rows });
  });
});

// Add a new country
app.post('/api/countries', upload.single('image'), (req, res) => {
  const { name } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!name || !imagePath) {
    return res.status(400).json({ error: 'Country name and image are required' });
  }

  db.run(
    'INSERT INTO countries (name, image_path) VALUES (?, ?)',
    [name, imagePath],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name: name,
        image_path: imagePath
      });
    }
  );
});

// Delete a country
app.delete('/api/countries/:id', (req, res) => {
  const { id } = req.params;

  // First get the image path to delete the file
  db.get('SELECT image_path FROM countries WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (row && row.image_path) {
      // Delete the image file
      const filePath = path.join(__dirname, 'uploads', row.image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    db.run('DELETE FROM countries WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Country deleted successfully' });
    });
  });
});

// Update a country
app.put('/api/countries/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const newImagePath = req.file ? req.file.filename : null;

  if (newImagePath) {
    // If new image is uploaded, delete the old one
    db.get('SELECT image_path FROM countries WHERE id = ?', [id], (err, row) => {
      if (row && row.image_path) {
        const filePath = path.join(__dirname, 'uploads', row.image_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    db.run(
      'UPDATE countries SET name = ?, image_path = ? WHERE id = ?',
      [name, newImagePath, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Country updated successfully' });
      }
    );
  } else {
    db.run(
      'UPDATE countries SET name = ? WHERE id = ?',
      [name, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Country updated successfully' });
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
