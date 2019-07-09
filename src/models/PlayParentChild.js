/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlayParentChild', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    subTitle: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    strokeDay: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    minPeopleNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    maxPeopleNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    masterImg: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    subImg: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    packAge: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    r1: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    r2: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    r3: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    r4: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    attrs: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isDel: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    busUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'PlayParentChild'
  });
};
