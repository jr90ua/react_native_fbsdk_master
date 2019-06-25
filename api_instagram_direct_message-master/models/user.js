'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Profile, {
      foreignKey: 'user_id',
      as: 'profile'
    });

    User.hasMany(models.Bot, {
      foreignKey: 'user_id',
      as: 'bot'
    })
  };
  return User;
};