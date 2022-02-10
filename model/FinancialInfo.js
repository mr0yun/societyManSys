class FinancialInfo{
  constructor(id, sId, dId, handler, type, amount, recordTime, remark){
    this.id = id;  // int
    this.s_id = sId;  // int
    this.d_id = dId;  //  int
    this.handler = handler;
    this.type = type;  // tinyint
    this.amount = amount; // decimal
    this.record_time = recordTime;  // datetime
    this.remark = remark;
  }
}

module.exports = FinancialInfo