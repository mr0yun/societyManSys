class News{
  constructor(id, pubId, sId, theme, content, pubTime){
    this._id = id;  // int
    this._pubId = pubId;  // int
    this._sId = sId;  // int
    this._theme = theme;
    this._content = content;
    this._pubTime = pubTime;  // datetime
  }
}

module.exports = News