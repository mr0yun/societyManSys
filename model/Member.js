class Member{
  constructor(id, uId, sId, dId, position, joinTime, user = null){
    this._id = id;  // int
    this._uId = uId;  // int
    this._sId = sId;  // int
    this._dId = dId;  // int
    this._position = position;
    this._joinTime = joinTime;  // datetime
    this._user = user;  // User
  }
}

module.exports = Member