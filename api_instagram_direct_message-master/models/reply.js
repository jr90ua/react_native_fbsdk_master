'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    bot_id: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  Reply.associate = function(models) {
    // associations can be defined here
    Reply.belongsTo(models.Bot, {
      foreignKey: 'id'
    });

    Reply.hasMany(models.ResponseHistory, {
      foreignKey: 'reply_id',
      as: 'responsehistory'
    });
  };
  return Reply;
};