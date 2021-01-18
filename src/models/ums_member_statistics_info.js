/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ums_member_statistics_info', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    consume_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    order_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    coupon_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    return_order_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    login_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attend_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fans_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    collect_product_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    collect_subject_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    collect_topic_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    collect_comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    invite_friend_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    recent_order_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ums_member_statistics_info'
  });
};
