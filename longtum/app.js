const express = require('express');
const swaggerui = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const port = 4000;

app.use(express.json());
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

let snacks = [
    {id : 1,name : "Poteto" ,price : 20},
    {id : 2,name : "Corn" , price : 15}
];

let counter = 3;

app.get ('/snacks',(req,res) =>{
    const snackList = snacks.map(snack =>{
        return{
            id : snack.id,
            name : snack.name,
            price : snack.price
            
        };
    });
    res.json(snackList);
});

app.get('/snacks/:id', (req, res) => {
    let id = Number(req.params.id);
    let snack = snacks.find(s => s.id === id);

    if (!snack) {
        return res.status(404).json({ message: "Snack not found" });
    }
    res.json(snack);
});

app.post('/snacks', (req, res) => {
    let newSnack = req.body;

    if (!newSnack.name || !newSnack.price) {
        return res.status(400).json({ message: "Name and Price are required" });
    }

    newSnack.id = counter++;
    snacks.push(newSnack);

    res.status(201).json({
        message: "Snack added successfully",
        data: newSnack
    });

});

app.put('/snacks/:id', (req, res) => {
    let id = Number(req.params.id);
    let updateData = req.body;
    let index = snacks.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Snack not found" });
    }   
    snacks[index].name = updateData.name || snacks[index].name;
    snacks[index].price = updateData.price || snacks[index].price;

    res.json({
        message: "Update snack complete",
        data: snacks[index]
    });
});

app.listen(port, () => {
    console.log(`- API: http://localhost:${port}`);
    console.log(`- Docs: http://localhost:${port}/api-docs`);
});