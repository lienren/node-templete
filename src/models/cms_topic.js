/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cms_topic', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attend_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attention_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    read_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    award_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    attend_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'cms_topic'
  });
};
