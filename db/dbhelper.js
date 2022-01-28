/* 本文件用于封装sql语句，使得在对应路由直接调用本文件中的方法即可，无须直接与数据库交互。 */
const query = require('./db');


// 查询制定表的所有记录
function queryAll(tableName){
  return query(`select * from ${tableName}`);
}

// 查询指定表是否有指定记录
function queryByOneString(tableName, colName, param){
  return query(`select * from ${tableName} where ${colName}='${param}'`);
}





