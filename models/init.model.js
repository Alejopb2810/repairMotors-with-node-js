const Repair = require('./repair.model');
const User = require('./user.model');

const initModel = () => {
  /* 1User <--------> M Repais*/
  User.hasMany(Repair);
  Repair.belongsTo(User);
};

module.exports = initModel;
