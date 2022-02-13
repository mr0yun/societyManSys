/** 生成 [n, m) 的随机数
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function random(n, m) {
  return Math.floor(Math.random() * (n - m) + m);
}

/** 获取本地时间
 * @returns {string} 格式为yyyy-MM-dd HH:mm:ss
 */
function getLocalDatetime(){
  let time = new Date();
  time.setHours(time.getHours()+8);
  return time.toJSON().slice(0, 19).replace('T', ' ');
}

/** 获取本地日期
 * @returns {string}
 */
function getLocalDate(){
  return new Date().toJSON().slice(0, 10);
}

/** 转换本地时间
 * @param {string} timestring
 * @returns {string} 格式为yyyy-MM-dd HH:mm:ss
 */
function TransferLocalDatetime(timestring){
  let time = new Date(timestring);
  time.setHours(time.getHours()+8);
  return time.toJSON().slice(0, 19).replace('T', ' ');
}

/** 转换本地日期
 * @param {string} timestring
 * @returns {string}
 */
function transferLocalDate(timestring){
  let time = new Date(timestring);
  time.setHours(time.getHours()+8);
  return time.toJSON().slice(0, 10);
}

module.exports = {random, getLocalDatetime, getLocalDate, TransferLocalDatetime, transferLocalDate}