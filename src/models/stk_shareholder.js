/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stk_shareholder', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pub_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    change_reason_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    change_reason: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    shareholder_rank: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    shareholder_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    shareholder_name_en: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    shareholder_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    shareholder_class_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    shareholder_class: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    share_number: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    share_ratio: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sharesnature_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    sharesnature: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    share_pledge_freeze: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    share_pledge: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    share_freeze: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ctime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'stk_shareholder'
  });
};
