import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import path from 'path';
import { sql, connect, disconnect } from './database/db';
import authRouter from './routers/authRouter';

dotenv.config({ path: '../../config.env' });
const PORT = parseInt(process.env.PORT || '1337', 10);
const app: Express = express();
app.use(express.json());

// Test our database connection
app.get('/api/db', async (req: Request, res: Response) => {
    try {
        const result = await sql.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);

        // Send the list of table names
        res.json(result.recordset);
    } catch (err) {
        // If there's an error, log it and send an error response
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Setting our routes
app.use('/api/auth', authRouter);











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

// app.disable()

connect().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });

process.on('SIGINT', disconnect);