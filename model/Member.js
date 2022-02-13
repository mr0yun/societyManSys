class Member{
  constructor(id, uId, sId, dId, position, joinTime){
    this.id = id;  // int
    this.u_id = uId;  // int
    this.s_id = sId;  // int
    this.d_id = dId;  // int
    this.position = position;
    this.join_time = joinTime;  // datetime
  }
  toString(){
    return `${this.u_id},${this.s_id},${this.d_id},'${this.position}','${this.join_time}'`;
  }
}

module.exports = Member