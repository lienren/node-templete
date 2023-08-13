var DataTypes = require("sequelize").DataTypes;
var _BaseApi = require("./BaseApi");
var _BaseConfig = require("./BaseConfig");
var _BaseErrorContext = require("./BaseErrorContext");
var _BaseImgCode = require("./BaseImgCode");
var _BaseMenu = require("./BaseMenu");
var _SuperManagerInfo = require("./SuperManagerInfo");
var _SuperManagerLoginfo = require("./SuperManagerLoginfo");
var _SuperManagerRoleInfo = require("./SuperManagerRoleInfo");
var _SuperRoleInfo = require("./SuperRoleInfo");
var _SuperRoleMenuInfo = require("./SuperRoleMenuInfo");
var _info_model_nums = require("./info_model_nums");
var _info_models = require("./info_models");
var _info_notifys = require("./info_notifys");
var _info_school_deps = require("./info_school_deps");
var _info_schools = require("./info_schools");
var _info_users = require("./info_users");
var _pagelogs = require("./pagelogs");

function initModels(sequelize) {
  var BaseApi = _BaseApi(sequelize, DataTypes);
  var BaseConfig = _BaseConfig(sequelize, DataTypes);
  var BaseErrorContext = _BaseErrorContext(sequelize, DataTypes);
  var BaseImgCode = _BaseImgCode(sequelize, DataTypes);
  var BaseMenu = _BaseMenu(sequelize, DataTypes);
  var SuperManagerInfo = _SuperManagerInfo(sequelize, DataTypes);
  var SuperManagerLoginfo = _SuperManagerLoginfo(sequelize, DataTypes);
  var SuperManagerRoleInfo = _SuperManagerRoleInfo(sequelize, DataTypes);
  var SuperRoleInfo = _SuperRoleInfo(sequelize, DataTypes);
  var SuperRoleMenuInfo = _SuperRoleMenuInfo(sequelize, DataTypes);
  var info_model_nums = _info_model_nums(sequelize, DataTypes);
  var info_models = _info_models(sequelize, DataTypes);
  var info_notifys = _info_notifys(sequelize, DataTypes);
  var info_school_deps = _info_school_deps(sequelize, DataTypes);
  var info_schools = _info_schools(sequelize, DataTypes);
  var info_users = _info_users(sequelize, DataTypes);
  var pagelogs = _pagelogs(sequelize, DataTypes);


  return {
    BaseApi,
    BaseConfig,
    BaseErrorContext,
    BaseImgCode,
    BaseMenu,
    SuperManagerInfo,
    SuperManagerLoginfo,
    SuperManagerRoleInfo,
    SuperRoleInfo,
    SuperRoleMenuInfo,
    info_model_nums,
    info_models,
    info_notifys,
    info_school_deps,
    info_schools,
    info_users,
    pagelogs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
