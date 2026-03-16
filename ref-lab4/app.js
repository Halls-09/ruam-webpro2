const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;

const secretKey = process.env.SECRET_KEY;
console.log("SECRET_KEY:", secretKey);


app.post("/login",(req ,res)=>{
    const {username} = req.body;

    let role;
    if (username === "admin") {
        role = "admin";
    }else{
        role = "user";
    }
    const payload = {
        username,
        role
    }
    const options = {
        expiresIn: "1h"
    }

    const token = jwt.sign(payload, secretKey, options);
    res.json({token, message: "Login successful"});
});

const authMiddleware = (req ,res ,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Unauthorized"})
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(403).json({message: "Forbidden"});
    }

    jwt.verify(token, secretKey, (err, decoded)=>{
        if (err) {
            return res.status(403).json({message: "Forbidden"});
        }
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    });
}
const checkAdmin = (req ,res, next) => {
    if(req.user.role === "admin"){
        next();
    }else{
        return res.status(403).json({message: "Forbidden"});
    }
}

app.get("/admin-only",authMiddleware,checkAdmin,(req ,res)=>{
    res.json({message: "This is admin only"});
})

app.listen(port, () => {
    console.log(`Server is running on port : http://localhost:${port}`);
});
