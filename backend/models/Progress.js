const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  watchedSec: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  watchedPct: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  validated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  evidence: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  tableName: 'progress',
});

module.exports = Progress;
