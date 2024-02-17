import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import path from 'path';

dotenv.config({ path: '../../config.env' });
const PORT = parseInt(process.env.PORT || '1337', 10);
const app: Express = express();

// Test our API
app.use('/api', (req: Request, res: Response) => {
    const status = {
        'status': 'Working',
    };
    res.send(status);
});

























// Serve the frontend
// Leave this alone for now
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
