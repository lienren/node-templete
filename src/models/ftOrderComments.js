/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ftOrderComments', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    orderSn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    starNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    commentRemark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    addTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'ftOrderComments'
  });
};
