//? ---------------| VALIDATION USERNAME |---------------
// return !something đã bao gồm: undefined, null và rỗng
// Thay vào đó sẽ sử dụng: return !something || something.trim() === "" để tránh khoảng trắng bị nhập dư bởi user
const checkEmptyUsername = (username) => {
  return !username;
};

const checkLengthUsername = (username) => {
  return username.length < 7 || username.length > 25;
};

const checkRegexUsername = (username) => {
  const usernameRegexPattern =
    /^[A-Za-z](?!.*[.\-_]{2})(?!.*[.\-_].*[.\-_])[A-Za-z0-9]*(?:[.\-_][A-Za-z0-9]+)*$/;
  return usernameRegexPattern.test(username);
};

//? ---------------| VALIDATION PASSWORD |---------------
const checkEmptyPassword = (password) => {
  return !password;
};

const checkLengthPassword = (password) => {
  return password.length < 7;
};

const checkRegexPassword = (password) => {
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*[!@#$%^&*]{2})(?!.*[!@#$%^&*][^A-Za-z0-9]).*$/;
  return passwordRegexPattern.test(password);
};

//? ---------------| VALIDATION EMAIL |---------------
const checkEmptyEmail = (email) => {
  return !email || email.trim() === "";
};

const checkRegexEmail = (email) => {
  const lowercaseEmail = email.trim().toLowerCase();
  const emailRegexPattern =
    /^[a-zA-Z0-9](?!.*[.\-_]{2})([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegexPattern.test(lowercaseEmail);
};

//? ---------------| VALIDATION DISPLAY NAME |---------------
const checkEmptyDisplayName = (displayName) => {
  return !displayName || displayName.trim() === "";
};

const checkLengthDisplayName = (displayName) => {
  return displayName.length < 2 || displayName.length > 50;
};

const checkRegexDisplayName = (name) => {
  const nameTrimmed = name.trim();
  const displayNameRegexPattern =
    /^[a-zA-ZĂÂÁÀẢÃẠẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌƠỚỜỞỠỢÔỐỒỔỖỘÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴăâắằẳẵặấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọơớờởỡợôốồổỗộúùủũụưứừửữựýỳỷỹỵ ]{2,50}(?<![ .'-])$/;
  return displayNameRegexPattern.test(nameTrimmed);
};

module.exports = {
  checkEmptyUsername,
  checkLengthUsername,
  checkRegexUsername,
  checkEmptyPassword,
  checkLengthPassword,
  checkRegexPassword,
  checkEmptyEmail,
  checkRegexEmail,
  checkEmptyDisplayName,
  checkLengthDisplayName,
  checkRegexDisplayName,
};
