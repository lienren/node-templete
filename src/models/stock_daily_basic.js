/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_daily_basic', {
    ts_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trade_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    close: {
      type: "DOUBLE",
      allowNull: true
    },
    turnover_rate: {
      type: "DOUBLE",
      allowNull: true
    },
    turnover_rate_f: {
      type: "DOUBLE",
      allowNull: true
    },
    volume_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    pe: {
      type: "DOUBLE",
      allowNull: true
    },
    pe_ttm: {
      type: "DOUBLE",
      allowNull: true
    },
    pb: {
      type: "DOUBLE",
      allowNull: true
    },
    ps: {
      type: "DOUBLE",
      allowNull: true
    },
    ps_ttm: {
      type: "DOUBLE",
      allowNull: true
    },
    dv_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    dv_ttm: {
      type: "DOUBLE",
      allowNull: true
    },
    total_share: {
      type: "DOUBLE",
      allowNull: true
    },
    float_share: {
      type: "DOUBLE",
      allowNull: true
    },
    free_share: {
      type: "DOUBLE",
      allowNull: true
    },
    total_mv: {
      type: "DOUBLE",
      allowNull: true
    },
    circ_mv: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'stock_daily_basic'
  });
};
