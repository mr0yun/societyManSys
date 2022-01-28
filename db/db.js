const mysql = require('mysql');
const CODE = require('../utils/code');

// 连接池
let pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'club',
  user: 'root',
  password: ''
})

// 对数据库进行增删改查操作的基础
function baseQuery(sql, callback){
  pool.getConnection(function(err, connection){
    connection.query(sql, function(err, rows){
      callback(err, rows);
      connection.release();
    })
  })
}

// 对baseQuery进行Promise包装
function query(sql){
  return new Promise((resolve, reject) => {
    baseQuery(sql, (err, data) => {
      if(err){
        resolve({
          message: '操作失败',
          code: CODE.ERROR,
          data: null
        });
        throw err;
      }
      resolve({
        message: '操作成功',
        code: CODE.SUCCESS,
        data: data
      })
    })
  })
}

module.exports = query;