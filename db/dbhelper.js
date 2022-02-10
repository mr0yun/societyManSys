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
const Activity = require('../model/Activity');
const Recruitment = require('../model/Recruitment');
const Candidate = require('../model/Candidate');
const News = require('../model/News');
const Participant = require('../model/Participant');

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
  },
  /** 修改社团的招新权限
   * @param {number} id
   * @param {number} power
   * @returns {boolean}
   */
  async updateSocietyRecruit(id, power){
    let updateSql = `update society set recruit_eligible = ${power} where id = ${id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
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
   async addFinancialInfo(fInfo){
    let insertSql = `insert into financialinfo values(null,${fInfo.s_id},${fInfo.d_id},'${fInfo.handler}',${fInfo.type},${fInfo.amount},'${fInfo.record_time}','${fInfo.remark}')`;
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
  async delFinancialInfo(id){
    let delSql = `delete from financialinfo where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改财务信息
   * @param {FinancialInfo} fInfo
   * @returns {boolean}
   */
  async updateFinancialInfo(fInfo){
    let updateSql = `update financialinfo set d_id='${fInfo.d_id}', handler='${fInfo.handler}', type=${fInfo.type}, amount=${fInfo.amount}, record_time='${fInfo.record_time}', remark='${fInfo.remark}' where id=${fInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 获取财务信息
   * @param {number} id
   * @returns {Result}
   */
  async getFinancialInfos(id){
    let querySql = `select f.*, d.name from (select * from financialinfo where s_id = ${id}) f join department d on f.d_id = d.id`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 按年获取财务信息
   * @param {number} id
   * @param {string} year
   * @returns {Result}
   */
   async getFinancialInfosByYear(id, year){
    let querySql = `select f.*, d.name from (select * from financialinfo where s_id = ${id} and record_time like '${year}%') f join department d on f.d_id = d.id`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const activityHelper = {
  /** 新建活动
   * @param {Activity} aInfo
   * @returns {boolean}
   */
   async addActivity(aInfo){
    let insertSql = `insert into activity values(null,'${aInfo.name}',${aInfo.s_id},'${aInfo.content}','${aInfo.place}','${aInfo.start_time}','${aInfo.end_time}',${aInfo.state},${aInfo.ratify})`;
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
  /** 删除活动
   * @param {number} id
   * @returns {boolean}
   */
  async delActivity(id){
    let delSql = `delete from activity where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改活动信息
   * @param {Activity} aInfo
   * @returns {boolean}
   */
  async updateActivity(aInfo){
    let updateSql = `update activity set name='${aInfo.name}', content='${aInfo.content}', place='${aInfo.place}', start_time='${aInfo.start_time}', end_time='${aInfo.end_time}' where id=${aInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 获取某社团活动信息
   * @param {number} id
   * @returns {Result}
   */
  async getActivities(id){
    let querySql = `select * from activity where s_id = ${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 获取所有活动信息
   * @returns {Result}
   */
   async getAllActivities(){
    let querySql = `select * from activity where state != 3`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 修改活动状态
   * @param {number} id
   * @param {number} state
   * @returns {boolean}
   */
   async updateActivityState(id, state){
    let updateSql = `update activity set state=${state} where id=${id}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  }
}

const recruitmentHelper = {
  /** 新建招募信息
   * @param {Recruitment} rInfo
   * @returns {boolean}
   */
   async addRecruitment(rInfo){
    let insertSql = `insert into recruitment values(null,${rInfo.s_id},${rInfo.d_id},${rInfo.recruit_num},'${rInfo.requirement}','${rInfo.start_time}','${rInfo.end_time}',${rInfo.state},${rInfo.ratify})`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除招募信息
   * @param {number} id
   * @returns {boolean}
   */
  async delRecruitment(id){
    let delSql = `delete from recruitment where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改招募信息
   * @param {Recruitment} rInfo
   * @returns {boolean}
   */
  async updateRecruitment(rInfo){
    let updateSql = `update recruitment set d_id=${rInfo.d_id}, recruit_num=${rInfo.recruit_num}, requirement='${rInfo.requirement}', start_time='${rInfo.start_time}', end_time='${rInfo.end_time}', state=${rInfo.state} where id=${rInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 查询某社团招募信息
   * @param {number} id
   * @returns {Result}
   */
  async getRecruitments(id){
    let querySql = `select * from recruitment where s_id=${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 查询所有招募信息
   * @returns {Result}
   */
   async getAllRecruitments(){
    let querySql = `select * from recruitment where state = 1`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const candidateHelper = {
  /** 新建候选人信息
   * @param {Candidate} cInfo
   * @returns {boolean}
   */
   async addCandidate(cInfo){
    let insertSql = `insert into candidate values(null,${cInfo.u_id},${cInfo.r_id},${cInfo.state},${cInfo.test_score},'${cInfo.interview_evaluation}',${cInfo.interview_score})`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除候选人信息
   * @param {number} id
   * @returns {boolean}
   */
  async delCandidate(id){
    let delSql = `delete from candidate where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改候选人信息
   * @param {Candidate} cInfo
   * @returns {boolean}
   */
  async updateCandidate(cInfo){
    let updateSql = `update candidate set state=${cInfo.state}, test_score=${cInfo.test_score}, interview_evaluation='${cInfo.interview_evaluation}', interview_score=${cInfo.interview_score} where id=${cInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 修改候选人面试信息
   * @param {number} id
   * @param {number} score
   * @param {string} evaluation
   * @param {boolean} pass
   * @returns {boolean}
   */
  async updateInterview(id, score, evaluation){
    let state = pass ? 3 : 5; 
    let updateSql = `update candidate set state=${state}, interview_evaluation='${evaluation}', interview_score=${score} where id=${id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 修改候选人状态
   * @param {number} id
   * @param {number} state
   * @returns {boolean}
   */
   async updateCandidateState(id, state){
    let updateSql = `update candidate set state=${state} where id=${id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 查询候选人信息
   * @param {number} id
   * @returns {Result}
   */
  async getCandidates(id){
    let querySql = `select c.*, u.real_name, u.gender, u.major, u.grade, u.class, u.stu_id from (select * from candidate where r_id=${id}) c join user u on c.u_id = u.id`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const newsHelper = {
  /** 新建新闻
   * @param {News} nInfo
   * @returns {boolean}
   */
   async addNews(nInfo){
    let insertSql = `insert into news values(null,'${nInfo.contributor}',${nInfo.s_id},'${nInfo.theme}','${nInfo.outline}','${nInfo.content}','${nInfo.published_time}')`;
    let res = await query(insertSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 删除新闻
   * @param {number} id
   * @returns {boolean}
   */
  async delNews(id){
    let delSql = `delete from news where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改新闻
   * @param {News} nInfo
   * @returns {boolean}
   */
  async updateNews(nInfo){
    let updateSql = `update news set contributor='${nInfo.contributor}', theme='${nInfo.theme}', outline='${nInfo.outline}', content='${nInfo.content}', published_time='${nInfo.published_time}' where id=${nInfo.id}`;
    let res = await query(updateSql);
    console.log(res);
    if (res.code === CODE.SUCCESS) return true;
    else return false;
  },
  /** 查询某社团新闻
   * @param {number} id
   * @returns {Result}
   */
  async getNews(id){
    let querySql = `select * from news where s_id=${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 查询所有新闻
   * @returns {Result}
   */
   async getAllNews(){
    let querySql = `select * from news`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  }
}

const participantHelper = {
  /** 参加活动
   * @param {Participant} pInfo
   * @returns {boolean}
   */
   async addParticipant(pInfo){
    let insertSql = `insert into participant values(null,${pInfo.u_id},${pInfo.a_id},${pInfo.state},'${pInfo.comment}',${pInfo.score},${pInfo.lottery})`;
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
  /** 退出活动
   * @param {number} id
   * @returns {boolean}
   */
  async delParticipant(id){
    let delSql = `delete from participant where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 评论活动
   * @param {number} aId
   * @param {number} uId
   * @param {number} score
   * @param {string} comment
   * @returns {boolean}
   */
   async updateParticipant(aId, uId, score, comment){
    let updateSql = `update participant set state=2, score=${score}, comment='${comment}' where a_id=${aId} and u_id=${uId}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改活动状态
   * @param {number} aId
   * @param {number} uId
   * @param {number} state
   */
   async updateParticipantState(aId, uId, state){
    let updateSql = `update participant set state=${state} where a_id=${aId} and u_id=${uId}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 查询某活动参加者
   * @param {number} id
   * @returns {Result}
   */
   async getParticipants(id){
    let querySql = `select * from participant where a_id=${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 修改活动中奖信息
   * @param {number} aId
   * @param {number} uId
   * @param {number} lottery
   */
   async updatelottery(aId, uId, lottery){
    let updateSql = `update participant set lottery=${lottery} where a_id=${aId} and u_id=${uId}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
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
  },
  /** 删除申请
   * @param {number} id
   * @returns {boolean}
   */
   async delApplication(id){
    let delSql = `delete from application where id=${id}`;
    let res = await query(delSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 获取某申请详细信息
   * @param {number} id
   * @returns {Result}
   */
  async getApplications(id){
    let querySql = `select * from application where id = ${id}`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 获取所有申请信息
   * @returns {Result}
   */
   async getAllApplications(){
    let querySql = `select * from application`;
    let res = await query(querySql);
    if(res.code === CODE.SUCCESS){
      return new Result('查询成功', res.code, JSON.stringify(res.data));
    }
    else return new Result('查询失败' + res.message, CODE.ERROR, null);
  },
  /** 审批申请
   * @param {number} id
   * @param {number} state
   * @param {string} time
   * @param {string} opinion
   * @returns {boolean}
   */
   async reviewApplication(id, state, time, opinion){
    let updateSql = `update application set state=${state}, review_time='${time}', review_opinion='${opinion}' where id=${id}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  },
  /** 修改许可
   * @param {string} table
   * @param {number} id
   * @param {number} ratify
   * @returns {boolean}
   */
   async updateRatify(table, id, ratify){
    let updateSql = `update ${table} set ratify=${ratify} where id=${id}`;
    let res = await query(updateSql);
    if(res.code === CODE.SUCCESS) return true;
    else {
      console.error(res.message);
      return false;
    }
  }
}



module.exports = {userHelper, societyHelper, departmentHelper, applicationHelper, memberHelper, financialHelper, activityHelper, recruitmentHelper, candidateHelper, newsHelper, participantHelper}
