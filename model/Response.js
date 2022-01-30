class Response{
  /**
   * @param {string} message 状态信息
   * @param {number} code 状态码
   * @param {boolean} carryData 是否携带数据
   * @param {string} dataType 携带数据类型
   * @param {string | number} data 数据内容
   */
  constructor(message, code, carryData, dataType, data){
    this.message = message;
    this.code = code;
    this.carryData = carryData;
    this.dataType = dataType;
    this.data = data;
  }
}

module.exports = Response