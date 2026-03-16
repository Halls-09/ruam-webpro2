const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); 
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let toys = [
    { id: 1, name: "Robot X", category: "Action Figure", price: 550, stock: 10 },
    { id: 2, name: "Lego City", category: "Blocks", price: 1200, stock: 5 }
];
let counter = 3; 

app.get('/toys', (req, res) => {
    const toyList = toys.map(toy => {
        return {
            id: toy.id,
            name: toy.name,
            category: toy.category,
            priceDisplay: `à¸¿${toy.price}`
        };
    });
    res.json(toyList);
});

app.post('/toys', (req, res) => {
    let newToy = req.body;

    if (!newToy.name || !newToy.price) {
        return res.status(400).json({ message: "Name and Price are required" });
    }

    newToy.id = counter++;
    toys.push(newToy);

    res.status(201).json({
        message: "Toy added to inventory",
        data: newToy
    });
});

app.get('/toys/:id', (req, res) => {
    let id = Number(req.params.id);
    let toy = toys.find(t => t.id === id);

    if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
    }
    res.json(toy);
});

app.put('/toys/:id', (req, res) => {
    let id = Number(req.params.id);
    let updateData = req.body;
    let index = toys.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Toy not found" });
    }

    toys[index].name = updateData.name || toys[index].name;
    toys[index].category = updateData.category || toys[index].category;
    toys[index].price = updateData.price || toys[index].price;
    toys[index].stock = updateData.stock || toys[index].stock;

    res.json({
        message: "Update toy complete",
        data: toys[index]
    });
});

app.delete('/toys/:id', (req, res) => {
    let id = Number(req.params.id);
    let index = toys.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Toy not found" });
    }

    toys.splice(index, 1);

    res.status(200).json({
        message: "Deleted toy from inventory successfully",
        indexDeleted: index
    });
});

app.listen(port, () => {
    console.log(`Toy Store API & Docs is running:`);
    console.log(`- API: http://localhost:${port}`);
    console.log(`- Docs: http://localhost:${port}/api-docs`);
});