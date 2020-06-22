/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ths_companymanager', {
    id: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notice_date: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    term_start: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    term_end: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    age: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    education: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    salary: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    direct_share: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    intro_update_date: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    mainintro: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updatetime: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ctime: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'ths_companymanager'
  });
};
