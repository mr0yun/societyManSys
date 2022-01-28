class Candidate{
  constructor(id, uId, rId, state = 0, testScore = 0, interEvaluation = "", interScore = 0){
    this._id = id;  // int
    this._uId = uId;  // int
    this._rId = rId;  // int
    this._state = state;  // tinyint 状态，0网申，1通过简历筛选，2通过笔试，3通过面试，4审批完成，5放弃
    this._testScore = testScore;  // tinyint
    this._interEvaluation = interEvaluation;
    this._interScore = interScore;  // tinyint
  }
}

module.exports = Candidate