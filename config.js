const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'VSB3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3307
});

module.exports = pool;
