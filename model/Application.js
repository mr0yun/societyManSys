class Application{
  constructor(id, type, title, content, state = 0, submitTime, reviewTime = null, reviewOpinion = ""){
    this._id = id;  // int
    this._type = type;  // tinyint 申请类型，创立社团1，创立部门2，组织活动3，招新4，考核5，评优6，注销社团7，注销部门8
    this._associatedId = 0;  // int
    this._title = title;
    this._content = content;
    this._imgUrls = "";
    this._fileUrls = "";
    this._state = state;  // tinyint 未审批0，已通过1，未通过2
    this._submitTime = submitTime;  // datetime
    this._reviewTime = reviewTime;  // datetime
    this._reviewOpinion = reviewOpinion;
  }
}

module.exports = Application;