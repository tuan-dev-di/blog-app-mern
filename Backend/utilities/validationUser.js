//? Check validation for Username
const checkEmptyUsername = (username) => {
  return !username || username === "";
};

const checkLengthUsername = (username) => {
  return username.length < 7 || username.length > 25;
};

const checkRegexUsername = (username) => {
  //* Regex Pattern for Username
  const usernameRegexPattern =
    /^[A-Za-z](?!.*[.\-_]{2})(?!.*[.\-_].*[.\-_])[A-Za-z0-9]*(?:[.\-_][A-Za-z0-9]+)*$/;
  return usernameRegexPattern.test(username);
};

//? Check validation for Password
const checkEmptyPassword = (password) => {
  return !password || password === "";
};

const checkLengthPassword = (password) => {
  return password.length < 7;
};

const checkRegexPassword = (password) => {
  //* Regex Pattern for Password
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*[!@#$%^&*]{2})(?!.*[!@#$%^&*][^A-Za-z0-9]).*$/;
  return passwordRegexPattern.test(password);
};

//? Check validation for Email
const checkEmptyEmail = (email) => {
  return !email || email === "";
};

const checkRegexEmail = (email) => {
  //* Regex Pattern for Email
  const emailRegexPattern =
    /^[a-zA-Z0-9](?!.*[.\-_]{2})([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegexPattern.test(email);
};

//? Check validation for Display Name
const checkEmptyDisplayName = (displayName) => {
  return !displayName || displayName === "";
};

const checkLengthDisplayName = (displayName) => {
  return displayName.length < 2 || displayName.length > 50;
};

const checkRegexDisplayName = (name) => {
  //* Regex Pattern for Display Name
  const displayNameRegexPattern =
    /^[a-zA-ZĂÂÁÀẢÃẠẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌƠỚỜỞỠỢÔỐỒỔỖỘÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴăâắằẳẵặấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọơớờởỡợôốồổỗộúùủũụưứừửữựýỳỷỹỵ ]{2,50}(?<![ .'-])$/;
  return displayNameRegexPattern.test(name);
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
