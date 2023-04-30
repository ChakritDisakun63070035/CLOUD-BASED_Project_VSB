const mysql = require('mysql');

const pool = mysql.createConnection({
  host: 'vsb-db.cccarfojkixq.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Vsb12345',
  database: 'my_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.connect((err) => {
  if(err){
    console.log(err.message)
    return;
  }
  console.log("Database connected")
});
