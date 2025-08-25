const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data/listings.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Get all listings
app.get('/api/listings', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data.' });
        res.json(JSON.parse(data));
    });
});

// Add a new listing
app.post('/api/listings', (req, res) => {
    const newListing = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data.' });
        const listings = JSON.parse(data);
        listings.push(newListing);
        fs.writeFile(DATA_FILE, JSON.stringify(listings, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save data.' });
            res.json({ success: true, listing: newListing });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
