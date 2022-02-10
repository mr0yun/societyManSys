class News{
  constructor(id, contributor, sId, theme, outline, content, pubTime){
    this.id = id;  // int
    this.contributor = contributor;
    this.s_id = sId;  // int
    this.theme = theme;
    this.outline = outline;
    this.content = content;
    this.published_time = pubTime;  // datetime
  }
}

module.exports = News