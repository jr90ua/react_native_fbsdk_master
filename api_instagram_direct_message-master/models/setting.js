'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    bot_id: DataTypes.INTEGER,
    max_comment_daily: DataTypes.INTEGER
  }, {});
  Setting.associate = function(models) {
    // associations can be defined here.
    Setting.belongsTo(models.Bot, {
      foreignKey: 'id'
    });
  };
  return Setting;
};