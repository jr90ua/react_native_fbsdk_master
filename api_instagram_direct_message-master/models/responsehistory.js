'use strict';
module.exports = (sequelize, DataTypes) => {
  const ResponseHistory = sequelize.define('ResponseHistory', {
    bot_id: DataTypes.INTEGER,
    messager_id: DataTypes.STRING,
    messager_name: DataTypes.STRING,
    message: DataTypes.STRING,
    reply_id: DataTypes.INTEGER
  }, {});
  ResponseHistory.associate = function(models) {
    // associations can be defined here
    ResponseHistory.belongsTo(models.Bot, {
      foreignKey: 'id'
    });

    ResponseHistory.belongsTo(models.Reply, {
      foreignKey: 'id'
    });
  };
  return ResponseHistory;
};