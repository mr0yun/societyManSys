class Participant{
  constructor(id, uId, aId, state = 0, comment = "", score = 0, lottery = 0){
    this.id = id;
    this.u_id = uId;
    this.a_id = aId;
    this.state = state;
    this.comment = comment;
    this.score = score;
    this.lottery = lottery;
  }
}

module.exports = Participant