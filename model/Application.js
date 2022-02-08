class thisication{
  constructor(id, type, title, content, uId, submitTime, reviewTime = null, state = 0, associatedId = 0,  imgUrls = "", fileUrls = "", reviewOpinion = ""){
    this.id = id;  // int
    this.type = type;  // tinyint 申请类型，创立社团1，创立部门2，组织活动3，招新4，考核5，评优6，注销社团7，注销部门8
    this.associated_id = associatedId;  // int
    this.u_id = uId;
    this.title = title;
    this.content = content;
    this.img_urls = imgUrls;
    this.file_urls = fileUrls;
    this.state = state;  // tinyint 未审批0，已通过1，未通过2
    this.submit_time = submitTime;  // datetime
    this.review_time = reviewTime;  // datetime
    this.review_opinion = reviewOpinion;
  }
  toString(){
    return `${this.type},${this.associated_id},${this.u_id},'${this.title}','${this.content}','${this.img_urls}','${this.file_urls}',${this.state},'${this.submit_time}','','${this.review_opinion}'`;
  }
}

module.exports = thisication;