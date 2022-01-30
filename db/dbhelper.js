/* 本文件用于封装sql语句，使得在对应路由直接调用本文件中的方法即可，无须直接与数据库交互。 */
const query = require("./db");
const { CODE } = require("../utils/constant");
const User = require("../model/User");
const jwt = require("../middleware/jwt");
const Result = require("../model/Result");

module.exports = {
  // 查询指定表的所有记录
  queryAll(tableName) {
    return query(`select * from ${tableName}`);
  },

  // 查询指定表是否有指定记录
  queryByOneString(tableName, colName, param) {
    return query(`select * from ${tableName} where ${colName}='${param}'`);
  },

  // user
  /**
   * 查询是否有重复用户名
   * @param {string} username
   * @return {boolean}
   */
  async haveRepeatUsername(username) {
    let querySql = `select * from user where user_name='${username}'`;
    let res = await query(querySql);
    if (res.code === CODE.SUCCESS && res.data.length == 0) return false;
    else return true;
  },

  /**
   * 新建用户
   * @param {User} userInfo
   * @return {boolean} 是否添加成功
   */
  async addUser(userInfo){
    let insertSql = `insert into user values(null, ${userInfo.toString()})`;
    let res = await query(insertSql);
    // console.log(res);
    if(res.code === CODE.SUCCESS) return true;
    else{
      console.error(res.message)
      return false;
    }
  },

  /**
   * 登录检查
   * @param {string} username
   * @param {string} psd
   * @returns {Result}
   */
  async loginCheck(username, psd){
    let querySql = `select * from user where user_name='${username}' and password='${psd}'`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS && res.data.length>0){
      // 用户名和密码正确，重新生成token
      let updateRes = await this.updateToken(username, psd)
      if(updateRes.isUpdated) {  
        // 更新token完成，重新查询user内容
        let newRes = await query(querySql);
        if(newRes.code === CODE.SUCCESS && newRes.data.length>0){
          let info = newRes.data[0];
          let user = new User(info.id, info.user_name, info.password, info.token, info.power, info.real_name, info.gender, info.major, info.grade, info.class, info.stu_id, info.email, info.phone, info.avatar_url);
          return new Result('登录成功', newRes.code, JSON.stringify(user));
        }
        return new Result('数据库错误：查询失败', newRes.code, newRes.data);
      }
      return new Result('数据库错误：更新token失败', CODE.ERROR, updateRes.data);
    }
    return new Result('用户名或密码错误', CODE.ERROR, res.data===[] ? null : res.data);
  },

  /**
   * 更新token，用于登录
   * @param {string} username
   * @param {string} psd
   * @returns {object}
   */
  async updateToken(username, psd){
    let token = jwt.sign(username, psd);
      let updateSql = `update user set token='${token}' where user_name='${username}'`;
      let res = await query(updateSql);
      if(res.code === CODE.SUCCESS){
        return {isUpdated: true, data: token};
      }
      else return {isUpdated: false, data: res.data};
  },

  /**
   * 检查用户token
   * @param {number} userId 用户id
   * @returns {boolean} true没过期，false过期需重新登录
   */
  async tokenCheck(userId){
    let querySql = `select token from user where id=${userId}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS && res.data.length>0){
      let checkRes = await jwt.verify(res.data.token);
      if(checkRes.code === CODE.SUCCESS) return true;
    }
    return false;
  }
};
