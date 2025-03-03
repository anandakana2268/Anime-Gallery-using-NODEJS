const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'anand_akana',
    password: '2268Anand',
    database: 'anime_gallery'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Add anime
app.post('/api/add-anime', upload.single('animeImage'), (req, res) => {
    console.log('Received data:', req.body);
    console.log('Received file:', req.file);

    const { animeTitle, animeLink, animeCategory } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!animeTitle || !animeLink || !animeCategory || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO animes (title, image_url, category, link) VALUES (?, ?, ?, ?)';
    db.query(query, [animeTitle, imageUrl, animeCategory, animeLink], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add anime' });
        }
        res.status(200).json({ message: 'Anime added successfully' });
    });
});

// Get animes
app.get('/api/get-animes', (req, res) => {
    const category = req.query.category || 'anime';  // Default category 'anime'
    const query = 'SELECT * FROM animes WHERE category = ? ORDER BY created_at DESC';

    db.query(query, [category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch animes' });
        }
        res.status(200).json(results);
    });
});

// User registration
app.post('/register', (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, password, role], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            res.status(500).json({ success: false, message: "Database error" });
        } else {
            res.status(201).json({ success: true, message: "User registered successfully" });
        }
    });
});

// User login
app.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?';
    db.query(query, [email, password, role], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({
                success: true,
                role: user.role,
                username: user.username // Ensure the `username` column exists in your database
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});


// Delete anime
app.delete('/api/delete-anime/:id', (req, res) => {
    const animeId = req.params.id;
    const query = 'DELETE FROM animes WHERE id = ?';

    db.query(query, [animeId], (err, results) => {
        if (err) {
            console.error('Error deleting anime:', err);
            return res.status(500).json({ error: 'Failed to delete anime' });
        }
        res.status(200).json({ message: 'Anime deleted successfully' });
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to fetch users' });
        }
        res.json({ success: true, users: results });
    });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to delete user' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    });
});

// Update user role
app.patch('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    db.query('UPDATE users SET role = ? WHERE id = ?', [role, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to update user role' });
        }
        res.json({ success: true, message: 'User role updated successfully' });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



