import dotenv from 'dotenv';
import mssql from 'mssql';
import path from 'path';

const projectRoot = path.join(__dirname, '../../..');
const configPath = path.join(projectRoot, 'config.env');

dotenv.config({ path: configPath });

const config: mssql.config = {
    server: process.env.DB_SERVER || '',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    connectionTimeout: 15000,
    options: {
        encrypt: true,
    }
};

// console.log(config);

export const sql = new mssql.ConnectionPool(config);

export const connect = async () => {
    try {
        await sql.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Database connection failed', err);
    }
};

export const disconnect = async () => {
    try {
        await sql.close();
        console.log('Disconnected from the database');
    } catch (err) {
        console.error('Database disconnection failed', err);
    }
}

export default sql;


