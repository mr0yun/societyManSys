class Participant{
  constructor(id, uId, aId, state = 0, comment = "", score = 0, lottery = 0){
    this._id = id;
    this._uId = uId;
    this._aId = aId;
    this._state = state;
    this._comment = comment;
    this._score = score;
    this._lottery = lottery;
  }
}

module.exports = Participant