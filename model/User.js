class User{
  constructor(id, username, password, token, power, realname, gender, major, grade, classes, stuId, email="", phone="", avatarUrl=""){
    this._id = id;  // int
    this._username = username;
    this._password = password;
    this._token = token;
    this._power = power;  // tinyint 普通用户为0，社长为1，管理员为2
    this._realname = realname;
    this._gender = gender; 
    this._major = major;
    this._grade = grade;
    this._class = classes;
    this._stuId = stuId;
    this._email = email;
    this._phone = phone;
    this._avatarUrl = avatarUrl;
  }
  /* constructor(row){
    this._id = row.id;  // int
    this._username = row.user_name;
    this._password = row.password;
    this._token = row.token;
    this._power = row.power;  // tinyint 普通用户为0，社长为1，管理员为2
    this._realname = row.real_name;
    this._gender = row.gender; 
    this._major = row.major;
    this._grade = row.grade;
    this._class = row.class;
    this._stuId = row.stu_id;
    this._email = row.email;
    this._phone = row.phone;
    this._avatarUrl = row.avatar_url;
  } */
  toString(){
    return `'${this._username}','${this._password}','${this._token}',${this._power},'${this._realname}','${this._gender}','${this._major}','${this._grade}','${this._class}','${this._stuId}','${this._email}','${this._phone}','${this._avatarUrl}'`;
  }
}

module.exports = User