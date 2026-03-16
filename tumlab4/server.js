const express = require('express');
const jwt = require('jsonwebtoken'); // 1. Use jsonwebtoken package

const app = express();
app.use(express.json()); // สำคัญ! ต้องมีเพื่อให้ Express อ่านข้อมูลแบบ JSON จาก req.body ได้

// คีย์ลับสำหรับสร้างและถอดรหัส Token (ในการทำงานจริงควรเก็บในไฟล์ .env)
const SECRET_KEY = "my_super_secret_key"; 

// =========================================================
// 2. Create a POST /login route
// =========================================================
app.post('/login', (req, res) => {
    // - Accepts username.
    const { username } = req.body; 

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    let payload;
    // - If username is "admin", sign a token with payload { role: 'admin' }.
    if (username === 'admin') {
        payload = { role: 'admin' };
    } 
    // - Otherwise, sign a token with payload { role: 'user' }.
    else {
        payload = { role: 'user' };
    }

    // สร้าง Token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // - Return the token to the client.
    res.json({ token: token }); 
});

// =========================================================
// 3. Create an Authentication Middleware
// =========================================================
const authenticateToken = (req, res, next) => {
    // - Extracts the token from the Authorization: Bearer <token> header.
    const authHeader = req.headers['authorization'];
    
    // authHeader จะมาในรูปแบบ "Bearer eyJhbGci..." เราเลยต้อง split เว้นวรรคแล้วเอาตัวที่ 2
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    // - Verifies the token.
    jwt.verify(token, SECRET_KEY, (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        
        // - If valid, attach the payload to req.user.
        req.user = decodedPayload; 
        next(); // ให้ไปทำงานในฟังก์ชันหรือ Middleware ถัดไป
    });
};

// =========================================================
// 4. Create an Authorization Middleware (checkAdmin)
// =========================================================
const checkAdmin = (req, res, next) => {
    // - Checks if req.user.role is exactly 'admin'.
    if (req.user && req.user.role === 'admin') {
        next(); // ถ้าเป็น admin ให้ผ่านไปได้
    } else {
        // - If not, return status 403 Forbidden.
        res.status(403).json({ message: "403 Forbidden: Admin access only." });
    }
};

// =========================================================
// 5. Create a protected route /admin-only that uses both middlewares.
// =========================================================
app.get('/admin-only', authenticateToken, checkAdmin, (req, res) => {
    res.json({ 
        message: "Welcome Admin! You have successfully accessed the protected route.",
        userRole: req.user.role
    });
});

// แถม: สร้าง route สำหรับ user ธรรมดาเพื่อทดสอบความแตกต่าง
app.get('/user-profile', authenticateToken, (req, res) => {
    res.json({ message: `Welcome user! Your role is ${req.user.role}` });
});

// เริ่มรันเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});