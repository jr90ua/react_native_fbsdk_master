'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bot = sequelize.define('Bot', {
    user_id: DataTypes.INTEGER,
    botname: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    delay: DataTypes.INTEGER,
    filters: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {});
  Bot.associate = function(models) {
    // associations can be defined here
    Bot.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Bot.hasMany(models.Comment, {
      foreignKey: 'bot_id',
      as: 'comment'
    });

    Bot.hasMany(models.Reply, {
      foreignKey: 'bot_id',
      as: 'reply'
    });

    Bot.hasMany(models.Setting, {
      foreignKey: 'bot_id',
      as: 'setting'
    });

    Bot.hasMany(models.ResponseHistory, {
      foreignKey: 'bot_id',
      as: 'responsehistory'
    });
  };
  return Bot;
};