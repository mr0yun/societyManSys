class Recruitment{
  constructor(id, sId, dId, recruitNum, requirement, startTime, endTime, state = 0, ratify = 0){
    this.id = id;  // int
    this.s_id = sId;  // int
    this.d_id = dId;  // int
    this.recruit_num = recruitNum;  // int
    this.requirement = requirement;
    this.start_time = startTime;  // datetime
    this.end_time = endTime;  // datetime
    this.state = state;  // tinyint
    this.ratify = ratify;  // tinyint
  }
}

module.exports = Recruitment