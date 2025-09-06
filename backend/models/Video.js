const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationSec: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  rewardAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2000,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  tableName: 'videos',
});

module.exports = Video;
