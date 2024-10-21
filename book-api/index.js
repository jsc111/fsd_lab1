const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const filePath = './books.json';

// Helper functions to read/write to file
const readDataFromFile = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData);
};

const writeDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Get all books
app.get('/books', (req, res) => {
    const books = readDataFromFile();
    res.json(books);
});

// Get a book by ID
app.get('/books/:id', (req, res) => {
    const books = readDataFromFile();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Add a new book
app.post('/books', (req, res) => {
    const books = readDataFromFile();
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        year: req.body.year
    };
    books.push(newBook);
    writeDataToFile(books);
    res.status(201).json(newBook);
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
    const books = readDataFromFile();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        writeDataToFile(books);
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const books = readDataFromFile();
    const updatedBooks = books.filter(b => b.id !== parseInt(req.params.id));
    if (books.length === updatedBooks.length) {
        return res.status(404).json({ message: 'Book not found' });
    }
    writeDataToFile(updatedBooks);
    res.json({ message: 'Book deleted successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
