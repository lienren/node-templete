/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('apply_volunteer', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    serviceContent: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    verifyStaus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    verifyStausName: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verifyRemark: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    verifyTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'apply_volunteer'
  });
};
