import mysql from 'mysql';

export const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'password',
    database: process.env.DB_NAME || 'testdb'
});