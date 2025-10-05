import { PrismaClient } from '@prisma/client';
import express from 'express';
import dotenv from 'dotenv';
const app = express();
const prisma = new PrismaClient();
const port = 3000;
app.get('/', (req, res) => {
    res.send("Hello World");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map