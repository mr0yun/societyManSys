class News{
  constructor(id, pubId, sId, theme, content, pubTime){
    this.id = id;  // int
    this.publisher_id = pubId;  // int
    this.s_id = sId;  // int
    this.theme = theme;
    this.content = content;
    this.published_time = pubTime;  // datetime
  }
}

module.exports = News