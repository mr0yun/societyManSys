class Candidate{
  constructor(id, uId, rId, state = 0, testScore = 0, interEvaluation = "", interScore = 0){
    this.id = id;  // int
    this.u_id = uId;  // int
    this.r_id = rId;  // int
    this.state = state;  // tinyint 状态，0网申，1通过简历筛选，2通过笔试，3通过面试，4审批完成，5放弃
    this.test_score = testScore;  // tinyint
    this.interview_evaluation = interEvaluation;
    this.interview_score = interScore;  // tinyint
  }
}

module.exports = Candidate