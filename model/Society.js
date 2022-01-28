class Society{
  constructor(id, name, president, founder, classification, fDate, intro, ratify = 0, recEligible = 0){
    this._id = id;  // int
    this._name = name;
    this._president = president;
    this._founder = founder;
    this._classification = classification;
    this._fDate = fDate;  // date
    this._intro = intro;
    this._ratify = ratify;  // tinyint
    this._recEligible = recEligible;  // tinyint
  }
}

module.exports = Society