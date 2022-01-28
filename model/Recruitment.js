class Recruitment{
  constructor(id, sId, dId, recruitNum, requirement, startTime, endTime, state = 0, ratify = 0){
    this._id = id;  // int
    this._sId = sId;  // int
    this._dId = dId;  // int
    this._recruitNum = recruitNum;  // int
    this._requirement = requirement;
    this._startTime = startTime;  // datetime
    this._endTime = endTime;  // datetime
    this._state = state;  // tinyint
    this._ratify = ratify;  // tinyint
  }
}

module.exports = Recruitment