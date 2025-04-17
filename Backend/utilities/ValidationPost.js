const { convert } = require("html-to-text");
// return !something đã bao gồm: undefined, null và rỗng
// Thay vào đó sẽ sử dụng: return !something || something.trim() === "" để tránh khoảng trắng bị nhập dư bởi user


//? ---------------| VALIDATION TITLE |---------------
const checkEmptyTitle = (title) => {
  return !title || title.trim() === "";
};

const checkLengthTitle = (title) => {
  return title.length < 10 || title.length > 50;
};

const checkRegexTitle = (title) => {
  const titleRegexPattern = /^[A-Z][a-zA-Z0-9]*(?: [a-zA-Z0-9]+)*$/;
  return titleRegexPattern.test(title);
};

//? ---------------| VALIDATION CONTENT |---------------

const checkEmptyContent = (content) => {
  return !content || content.trim() === "";
};

const checkLengthContent = (content) => {
  return content.length < 50 || content.length > 5000;
};

// const checkRegexContent = (content) => {
  
//   // const contentRegexPattern = /^[A-Z][a-zA-Z0-9\s]*\S$/;
//   const contentRegexPattern =
//     /^[A-Z][a-zA-Z0-9]*(?: [a-zA-Z0-9\*\_\-\[\]\(\)\.\,\?\!\#]+)*$/;
//   const convertContent = convert(content, { wordwrap: false });
//   return contentRegexPattern.test(convertContent);
// };

module.exports = {
  checkEmptyTitle,
  checkLengthTitle,
  checkRegexTitle,
  checkEmptyContent,
  checkLengthContent,
  // checkRegexContent,
};
