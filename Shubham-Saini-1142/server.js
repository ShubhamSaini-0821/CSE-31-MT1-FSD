
const express = require('express');
const app = express();
const port = 3000;
// Middleware
app.use(express.json());
// Initial Data
let Books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];
// Validate book data
function validateBook(book) {
    return book &&
        typeof book.title === 'string' && book.title.trim() !== '' &&
        typeof book.author === 'string' && book.author.trim() !== '' &&
        typeof book.genre === 'string' && book.genre.trim() !== '' &&
        Number.isInteger(book.publishedYear) &&
        typeof book.available === 'boolean';
}

// 1-GET all books
app.get('/api/books', (req, res) => {
    res.status(200).json(Books);
});

// 2-POST a new book
app.post('/api/books', (req, res) => {
    const newBook = req.body;

    if (!validateBook(newBook)) {
        return res.status(400).json({
            message: 'Invalid input data'
        });
    }

    const newId = Math.max(100, ...Books.map(b => b.id)) + 1;

    const book = {
        id: newId,
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        publishedYear: newBook.publishedYear,
        available: newBook.available
    };

    Books.push(book);

    res.status(201).json(book);
});

// 3-GET book by ID
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const book = Books.find(b => b.id === bookId);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({
            message: 'Book not found'
        });
    }
});

// 4-PUT/update a book by ID
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const updatedBook = req.body;

    const index = Books.findIndex(b => b.id === bookId);

    if (index === -1) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    if (!validateBook(updatedBook)) {
        return res.status(400).json({
            message: 'Invalid input data'
        });
    }

    Books[index] = {
        id: bookId,
        title: updatedBook.title,
        author: updatedBook.author,
        genre: updatedBook.genre,
        publishedYear: updatedBook.publishedYear,
        available: updatedBook.available
    };

    res.status(200).json(Books[index]);
});

// 5-DELETE a book by ID
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const index = Books.findIndex(b => b.id === bookId);

    if (index !== -1) {
        const deletedBook = Books.splice(index, 1);

        res.status(200).json({
            message: 'Book deleted successfully',
            book: deletedBook[0]
        });
    } else {
        res.status(404).json({
            message: 'Book not found'
        });
    }
});

// 6-FILTER records by author
// Keep this route before /:id
app.get('/api/books/filter/:author', (req, res) => {
    const author = req.params.author;
    console.log('Author:', author);

    if (typeof author !== 'string') {
        return res.status(200).json([]);
    }

    const filteredBooks = Books.filter(
        b => b.author.toLowerCase() === author.toLowerCase()
    );

    res.status(200).json(filteredBooks);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
