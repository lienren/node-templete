/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pms_comment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    member_nick_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    star: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    member_ip: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    show_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    product_attribute: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    collect_couont: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    read_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pics: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    member_icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    replay_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'pms_comment'
  });
};
