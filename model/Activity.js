class Activity{
  constructor(id, name, sId, content, place, startTime, endTime, state = 0, ratify = 0){
    this.id = id;  // int
    this.name = name;
    this.s_id = sId;  // int
    this.content = content;
    this.place = place;
    this.start_time = startTime;  // datetime
    this.end_time = endTime;  // datetime
    this.state = state;  // tinyint 活动状态，未开始0，进行中1，已结束2
    this.ratify = ratify;  // tinyint 审批状态，0未审批，1不通过，2通过
  }
}

module.exports = Activity;