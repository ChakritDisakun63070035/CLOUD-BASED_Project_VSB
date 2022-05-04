const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
<<<<<<< Updated upstream
  password: '931755',
  database: 'VSB_11',
=======
  password: '123456',
  database: 'VSB2',
>>>>>>> Stashed changes
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;