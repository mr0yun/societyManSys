class User{
  constructor(id, username, password, token, power, realname, gender, major, grade, classes, stuId, email="", phone="", avatarUrl=""){
    this.id = id;  // int
    this.user_name = username;
    this.password = password;
    this.token = token;
    this.power = power;  // tinyint 普通用户为0，社长为1，管理员为2
    this.real_name = realname;
    this.gender = gender; 
    this.major = major;
    this.grade = grade;
    this.class = classes;
    this.stu_id = stuId;
    this.email = email;
    this.phone = phone;
    this.avatar_url = avatarUrl;
  }
  toString(){
    return `'${this.user_name}','${this.password}','${this.token}',${this.power},'${this.real_name}','${this.gender}','${this.major}','${this.grade}','${this.class}','${this.stu_id}','${this.email}','${this.phone}','${this.avatar_url}'`;
  }
}

module.exports = User