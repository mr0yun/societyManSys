class FinancialInfo{
  constructor(id, sId, dId, handler, type, amount, recordTime){
    this._id = id;  // int
    this._sId = sId;  // int
    this._dId = dId;  //  int
    this._handler = handler;
    this._type = type;  // tinyint
    this._amount = amount; // decimal
    this._recordTime = recordTime;  // datetime
  }
}

module.exports = FinancialInfo