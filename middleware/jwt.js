const jwt = require('jsonwebtoken');
const Result = require('../model/Result');
const { CODE } = require('../utils/constant');
const SECERT = 'societyManSys';

/**
 * 生成token
 * @param {number} id 用户id
 * @param {string} name 用户名
 * @returns {string} 生成的token
 */
function sign(id, name){
  // 默认加密算法 (HMAC SHA256)
  // 有效时间设置为1h
  return jwt.sign({userId: id, username: name}, SECERT, {expiresIn: 3600});  
}

/**
 * 校验token
 * @param {string} token 待校验的token字符串
 * @returns {Promise<object>} 
 */
function verify(token){
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECERT, (err, decoded)=>{
      if(err){
        resolve(new Result(`校验失败! ${err.name}: ${err.message}`, CODE.ERROR, err));
      };
      resolve(new Result('校验成功', CODE.SUCCESS, decoded));
    });
  })
}

module.exports = {sign, verify}