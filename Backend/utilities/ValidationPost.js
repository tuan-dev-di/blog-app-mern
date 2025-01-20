//? ==================== VALIDATION TITLE ====================
const checkEmptyTitle = (title) => {
  return !title || title === "";
};

const checkLengthTitle = (title) => {
  return title.length < 10 || title.length > 50;
};

//? ==================== VALIDATION CATEGORY ====================
const checkEmptyCategory = (category) => {
  return !category || category === "";
};

//? ==================== VALIDATION CONTENT ====================

const checkEmptyContent = (content) => {
  return !content || content === "";
};

//? ==================== VALIDATION IMAGE POST ====================
const checkEmptyImage = (image) => {
  return !image || image === "";
};

module.exports = {
  checkEmptyTitle,
  checkLengthTitle,
  checkEmptyCategory,
  checkEmptyContent,
};
