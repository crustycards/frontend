module.exports.isEmail = (emailString) => {
  let split = emailString.split('@');
  if (!split[1]) {
    return false;
  }

  split = split[1].split('.');
  if (!split[1]) {
    return false
  }

  return true;
};