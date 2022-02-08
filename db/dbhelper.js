/* 本文件用于封装sql语句，使得在对应路由直接调用本文件中的方法即可，无须直接与数据库交互。 */
const query = require("./db");
const { CODE } = require("../utils/constant");
const jwt = require("../middleware/jwt");

const User = require("../model/User");
const Result = require("../model/Result");
const Society = require("../model/Society");
const Department = require("../model/Department");
const Application = require("../model/Application");
const Member = require("../model/Member");
const FinancialInfo = require("../model/FinancialInfo");

const userHelper = {
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
  async addUser(userInfo) {
    let insertSql = `insert into user values(null, ${userInfo.toString()})`;
    let res = await query(insertSql);
    // console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },

  /**
   * 登录检查
   * @param {string} username
   * @param {string} psd
   * @param {boolean} update 是否要更新token
   * @returns {Result}
   */
  async loginCheck(username, psd, update = true) {
    let querySql = `select * from user where user_name='${username}' and password='${psd}'`;
    let res = await query(querySql);
    if (res.code === CODE.SUCCESS && res.data.length > 0) {
      if (update) {
        // 用户名和密码正确，重新生成token
        let updateRes = await this.updateToken(username, psd);
        if (updateRes.isUpdated) {
          // 更新token完成，重新查询user内容
          let newRes = await query(querySql);
          if (newRes.code === CODE.SUCCESS && newRes.data.length > 0) {
            let info = newRes.data[0];
            return new Result("登录成功", newRes.code, JSON.stringify(info));
          }
          return new Result("数据库错误：查询失败", newRes.code, newRes.data);
        }
        return new Result("数据库错误：更新token失败", CODE.ERROR, updateRes.data);
      }
      else return new Result("验证通过，未更新token", res.code, null);
    }
    return new Result("用户名或密码错误", CODE.ERROR, res.data === [] ? null : res.data);
  },

  /**
   * 更新token，用于登录
   * @param {string} username
   * @param {string} psd
   * @returns {object}
   */
  async updateToken(username, psd) {
    let token = jwt.sign(username, psd);
    let updateSql = `update user set token='${token}' where user_name='${username}'`;
    let res = await query(updateSql);
    if (res.code === CODE.SUCCESS) {
      return { isUpdated: true, data: token };
    } else return { isUpdated: false, data: res.data };
  },

  /**
   * 检查用户token
   * @param {number} userId 用户id
   * @param {string} userToken 用户token
   * @returns {boolean} true没过期，false过期需重新登录
   */
  async tokenCheck(userId, userToken) {
    let querySql = `select token from user where id=${userId}`;
    let res = await query(querySql);
    if (
      res.code === CODE.SUCCESS &&
      res.data.length > 0 &&
      res.data[0].token === userToken
    ) {
      let checkRes = await jwt.verify(res.data[0].token);
      if (checkRes.code === CODE.SUCCESS) return true;
    }
    return false;
  },

  /** 修改用户个人信息
   * @param {User} userInfo
   * @returns {boolean}
   */
  async updateUser(userInfo) {
    let updateSql = `update user set real_name='${userInfo.real_name}', gender='${userInfo.gender}', major='${userInfo.major}', grade='${userInfo.grade}', class='${userInfo.class}', stu_id='${userInfo.stu_id}', email='${userInfo.email}', phone='${userInfo.phone}' where id=${userInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },

  /** 修改用户密码
   * @param {string} username
   * @param {string} psd
   * @returns {boolean}
   */
  async updatePassword(username, psd) {
    let updateSql = `update user set password='${psd}' where user_name='${username}'`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  }
};

const societyHelper = {

  /** 新建社团
   * @param {Society} sInfo
   * @returns {number | boolean}
   */
  async addSociety(sInfo){
    let insertSql = `insert into society values(null,'${sInfo.name}',${sInfo.u_id},'${sInfo.president}','${sInfo.founder}','${sInfo.classification}','${sInfo.founding_date}','${sInfo.introduction}',${sInfo.ratify}, ${sInfo.recruit_eligible})`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS){
      let querySql = `select id from society where name='${sInfo.name}'`;
      let queryRes = await query(querySql);
      if(queryRes.code === CODE.SUCCESS) return queryRes.data[0].id;
      else false;
    }
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除社团
   * @param {number} id
   * @returns {boolean}
   */
  async delSociety(id){
    let delSql = `delete from society where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改社团信息
   * @param {Society} sInfo
   * @returns {boolean}
   */
  async updateSociety(sInfo){
    let updateSql = `update society set president='${sInfo.president}', introduction='${sInfo.introduction}' where id=${sInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 查询社团信息
   * @param {number} id
   * @returns {Result}
   */
  async getSocieties(id){
    let querySql = `select * from society where u_id=${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const departmentHelper = {
  /** 新建部门
   * @param {Department} dInfo
   * @returns {boolean | number}
   */
  async addDepartment(dInfo){
    let insertSql = `insert into department values(null,'${dInfo.name}',${dInfo.s_id},'${dInfo.founding_date}','${dInfo.minister}','${dInfo.introduction}',${dInfo.member_num},${dInfo.ratify})`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS){
      let querySql = `select id from department where name='${dInfo.name}'`;
      let queryRes = await query(querySql);
      if(queryRes.code === CODE.SUCCESS) return queryRes.data[0].id;
      else false;
    }
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除部门
   * @param {number} id
   * @returns {boolean}
   */
  async delDepartment(id){
    let delSql = `delete from department where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改部门信息
   * @param {Department} dInfo
   * @returns {boolean}
   */
  async updateDepartment(dInfo){
    let updateSql = `update department set minister='${dInfo.minister}', introduction='${dInfo.introduction}' where id=${dInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 查询部门信息
   * @param {number} id
   * @returns {Result}
   */
  async getDepartments(id){
    let querySql = `select * from department where s_id=${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const memberHelper = {

  /** 添加成员
   * @param {Member} mInfo
   * @returns {boolean}
   */
  async addMember(mInfo){
    let insertSql = `insert into member values(null,${mInfo.u_id},${mInfo.s_id},${mInfo.d_id},'${mInfo.position}','${mInfo.join_time}')`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS){
      return true;
    }
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除成员
   * @param {number} id
   * @returns {boolean}
   */
  async delMember(id){
    let delSql = `delete from member where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改成员信息
   * @param {Member} mInfo
   * @returns {boolean}
   */
  async updateMember(mInfo){
    let updateSql = `update member set d_id='${mInfo.d_id}', position='${mInfo.position}' where id=${mInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 获取成员信息
   * @param {number} id
   * @returns {Result}
   */
  async getMembers(id){
    let querySql = `select m.*, d.name, u.real_name, u.gender, u.major, u.grade, u.class, u.stu_id from (select * from member where s_id = ${id}) m join department d on m.d_id = d.id join user u on m.u_id = u.id
    `;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const financialHelper = {
  /** 添加财务信息
   * @param {FinancialInfo} fInfo
   * @returns {boolean}
   */
   async addMember(fInfo){
    let insertSql = `insert into financialinfo values(null,${fInfo.s_id},${fInfo.d_id},'${fInfo.handler}',${fInfo.type},${fInfo.amount},'${fInfo.record_time}')`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS){
      return true;
    }
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除财务信息
   * @param {number} id
   * @returns {boolean}
   */
  async delMember(id){
    let delSql = `delete from member where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改财务信息
   * @param {Member} fInfo
   * @returns {boolean}
   */
  async updateMember(fInfo){
    let updateSql = `update member set d_id='${fInfo.d_id}', position='${fInfo.position}' where id=${fInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 获取财务信息
   * @param {number} id
   * @returns {Result}
   */
  async getMembers(id){
    let querySql = `select m.*, d.name, u.real_name, u.gender, u.major, u.grade, u.class, u.stu_id from (select * from member where s_id = ${id}) m join department d on m.d_id = d.id join user u on m.u_id = u.id
    `;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const applicationHelper = {
  /** 添加一条申请
   * @param {Application} appl
   * @returns {boolean}
   */
  async addApplication(appl){
    let insertSql = `insert into application values(null,${appl.type},${appl.associated_id},${appl.u_id},'${appl.title}','${appl.content}','${appl.img_urls}','${appl.file_urls}',${appl.state},'${appl.submit_time}','','${appl.review_opinion}')`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  }
}



module.exports = {userHelper, societyHelper, departmentHelper, applicationHelper, memberHelper}
