/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info_house_check', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    hhid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    a1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ha2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cUsers: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    cContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cResult: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isProblem: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cProblem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cProblemImgs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cMeasure: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cLevel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reviewTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cUnUser: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    parent_ids: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'info_house_check'
  });
};
