class Activity{
  constructor(id, name, sId, content, place, startTime, endTime, state = 0, ratify = 0){
    this._id = id;  // int
    this._name = name;
    this._sId = sId;  // int
    this._content = content;
    this._place = place;
    this._startTime = startTime;  // datetime
    this._endTime = endTime;  // datetime
    this._state = state;  // tinyint 活动状态，未开始0，进行中1，已结束2
    this._ratify = ratify;  // tinyint 审批状态，0未审批，1不通过，2通过
  }
}

module.exports = Activity;