const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.json()); 
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let books = [
    { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fantasy", price: 450, stock: 15 },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Technology", price: 1200, stock: 5 },
    { id: 3, title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", price: 890, stock: 8 },
    { id: 4, title: "Atomic Habits", author: "James Clear", category: "Self-Improvement", price: 380, stock: 20 },
    { id: 5, title: "1984", author: "George Orwell", category: "Dystopian", price: 290, stock: 12 },
    { id: 6, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Education", price: 1550, stock: 3 },
    { id: 7, title: "The Da Vinci Code", author: "Dan Brown", category: "Mystery", price: 320, stock: 10 },
    { id: 8, title: "Sapiens", author: "Yuval Noah Harari", category: "History", price: 550, stock: 7 },
    { id: 9, title: "Design Patterns", author: "Erich Gamma", category: "Technology", price: 1100, stock: 4 },
    { id: 10, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", price: 420, stock: 6 }
];

let counter = 11;


app.get('/books', (req, res) => {
    const { search, sort } = req.query; 

    let result = [...books]; // 2. copy ข้อมูลมาพักไว้

    // 3. Logic การค้นหา
    if (search) {
        result = result.filter(book => 
            book.title.toLowerCase().includes(search.toLowerCase()) 
            
        );
    }

    // 4. Logic การเรียงลำดับ
    if (sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        result.sort((a, b) => b.price - a.price);
    }
   

    res.status(200).json(result);
});

app.post('/books', (req, res) => {
    let newBook = req.body;
    if (!newBook.title || !newBook.author || !newBook.price) {
        return res.status(400).json({ message: "Title, Author, and Price are required" });
    }

    newBook.id = counter++;
    books.push(newBook);

    res.status(201).json({
        message: "Book added to inventory",
        data: newBook
    });
});

app.get('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

app.put('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let updateData = req.body;
    let index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[index].title = updateData.title || books[index].title;
    books[index].author = updateData.author || books[index].author;
    books[index].category = updateData.category || books[index].category;
    books[index].price = updateData.price || books[index].price;
    books[index].stock = updateData.stock || books[index].stock;

    res.json({
        message: "Update book complete",
        data: books[index]
    });
});

app.delete('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Deleted book from inventory successfully",
        indexDeleted: index
    });
});

app.listen(port, () => {
    console.log(`Book Store API & Docs is running:`);
    console.log(`- API: http://localhost:${port}`);
    console.log(`- Docs: http://localhost:${port}/api-docs`);
});