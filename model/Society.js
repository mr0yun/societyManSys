class Society{
  constructor(id, name, uId, president, founder, classification, fDate, intro, ratify = 0, recEligible = 0){
    this.id = id;  // int
    this.name = name;
    this.u_id = uId;  // int
    this.president = president;
    this.founder = founder;
    this.classification = classification;
    this.founding_date = fDate;  // date
    this.introduction = intro;
    this.ratify = ratify;  // tinyint
    this.recruit_eligible = recEligible;  // tinyint
  }
  toString(){
    return `'${this.name}',${this.u_id},'${this.president}','${this.founder}','${this.classification}','${this.founding_date}','${this.introduction}',${this.ratify}, ${this.recruit_eligible}`;
  }
}

module.exports = Society