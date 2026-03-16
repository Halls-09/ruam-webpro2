const express = require('express');
const BookSerializer = require('./serializers/book.serializer'); 
const app = express();

const books = [
    {
        id: 1, 
        title: "The Clean Coder", 
        author: "Robert C. Martin", 
        isbn: "9780137081073"
        
    },
    {
        id: 2, 
        title: "Refactoring", 
        author: "Martin Fowler", 
        isbn: "9780134757599"
    },
    {
        id: 3, 
        title: "Don't Make Me Think", 
        author: "Steve Krug", 
        isbn: "9780321965516"
    }
];


app.get('/api/books/:id', (req, res) => {
    
    let id = Number(req.params.id);
    let book = books.find(b => b.id === id);

    if (!book) {
    return res.status(404).json({
        errors: [
            {
                status: "404",
                title: "Resource Not Found",
                detail: `Book not found with id ${id}`
            }
        ]
    });
    }

    const jsonApiData = BookSerializer.serialize(book);

    res.set('Content-Type', 'application/vnd.api+json');
    res.send(jsonApiData);
});


const PORT = 8000;
app.listen(PORT, () => {
  console.log(`JSON:API Server is running on http://localhost:${PORT}`);
});