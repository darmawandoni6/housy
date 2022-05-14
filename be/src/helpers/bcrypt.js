const bcrypt = require("bcrypt");

module.exports = {
  encrypt: (password) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },

  compare: (password, encrypt) => {
    return bcrypt.compareSync(password, encrypt);
  },
};
