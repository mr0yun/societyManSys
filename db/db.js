const mysql = require('mysql');

// 连接池
let pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'club',
  user: 'root',
  password: ''
})

// 对数据库进行增删改查操作的基础
function query(sql, callback){
  pool.getConnection(function(err, connection){
    connection.query(sql, function(err, rows){
      callback(err, rows);
      connection.release();
    })
  })
}

module.exports = {
  query
}