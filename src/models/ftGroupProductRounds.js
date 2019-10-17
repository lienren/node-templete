/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftGroupProductRounds', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    groupName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    proId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    roundId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isOver: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    overTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftGroupProductRounds'
  });
};
