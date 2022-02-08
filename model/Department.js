class Department{
  constructor(id, name, sId, fDate, minister, intro = "", memberNum = 0, ratify = 0){
    this.id = id;  // int
    this.name = name;
    this.s_id = sId;  // int
    this.founding_date = fDate;  // date 成立时间
    this.minister = minister;
    this.introduction = intro;
    this.member_num = memberNum;  // int 人数
    this.ratify = ratify;  // tinyint 审批状态，0未审批，1不通过，2通过
  }
  toString(){
    return `'${this.name}',${this.s_id},'${this.founding_date}','${this.minister}','${this.introduction}',${this.member_num},${this.ratify}`;
  }
}

module.exports = Department