class Response{
  /**
   * @param {string} message 状态信息
   * @param {number} code 状态码
   * @param {boolean} carryData 是否携带数据
   * @param {string} dataType 携带数据类型
   * @param {string | number} data 数据内容
   * @param {boolean} relogin 是否需要重新登录
   */
  constructor(message, code, carryData, dataType = null, data = null, relogin = false){
    this.message = message;
    this.code = code;
    this.carryData = carryData;
    this.dataType = dataType;
    this.data = data;
    this.relogin = relogin;
  }
}

module.exports = Response