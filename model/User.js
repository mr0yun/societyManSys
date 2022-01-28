class User{
  constructor(id, username, password, token, power, realname, gender, major, grade, classes, stuId){
    this._id = id;  // number
    this._username = username;
    this._password = password;
    this._token = token;
    this._power = power;  // number 普通用户为0，社长为1，管理员为2
    this._realname = realname;
    this._gender = gender;  // number 1表示男性，0表示女性
    this._major = major;
    this._grade = grade;
    this._class = classes;
    this._stuId = stuId;
    this._email = "";
    this._phone = "";
    this._avatarUrl = "";
  }
}

module.export = User