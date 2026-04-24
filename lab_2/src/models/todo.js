const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const todo = sequelize.define('todo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'archived'),
    allowNull: false,
    defaultValue: 'pending',
  },
  newFieldForMigration: {
    type: DataTypes.STRING,
  }
}, {
  paranoid: true,
  timestamps: true,
});

module.exports = todo;