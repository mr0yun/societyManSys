class Department{
  constructor(id, name, sId, fDate, intro, memberNum, ratify = 0){
    this._id = id;  // int
    this._name = name;
    this._sId = sId;  // int
    this._fDate = fDate;  // date 成立时间
    this._intro = intro;
    this._memberNum = memberNum;  // int 人数
    this._ratify = ratify;  // tinyint 审批状态，0未审批，1不通过，2通过
  }
}

module.exports = Department