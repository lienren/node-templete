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
var _info_house = require("./info_house");
var _info_house_check = require("./info_house_check");
var _info_house_check_shops = require("./info_house_check_shops");
var _info_house_check_users = require("./info_house_check_users");
var _info_house_contract = require("./info_house_contract");
var _info_house_having = require("./info_house_having");
var _info_house_update = require("./info_house_update");
var _info_house_yearrent = require("./info_house_yearrent");
var _info_progress = require("./info_progress");
var _info_project_management = require("./info_project_management");
var _info_project_update = require("./info_project_update");
var _info_projects = require("./info_projects");
var _info_projects_sub = require("./info_projects_sub");
var _info_worker = require("./info_worker");
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
  var info_house = _info_house(sequelize, DataTypes);
  var info_house_check = _info_house_check(sequelize, DataTypes);
  var info_house_check_shops = _info_house_check_shops(sequelize, DataTypes);
  var info_house_check_users = _info_house_check_users(sequelize, DataTypes);
  var info_house_contract = _info_house_contract(sequelize, DataTypes);
  var info_house_having = _info_house_having(sequelize, DataTypes);
  var info_house_update = _info_house_update(sequelize, DataTypes);
  var info_house_yearrent = _info_house_yearrent(sequelize, DataTypes);
  var info_progress = _info_progress(sequelize, DataTypes);
  var info_project_management = _info_project_management(sequelize, DataTypes);
  var info_project_update = _info_project_update(sequelize, DataTypes);
  var info_projects = _info_projects(sequelize, DataTypes);
  var info_projects_sub = _info_projects_sub(sequelize, DataTypes);
  var info_worker = _info_worker(sequelize, DataTypes);
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
    info_house,
    info_house_check,
    info_house_check_shops,
    info_house_check_users,
    info_house_contract,
    info_house_having,
    info_house_update,
    info_house_yearrent,
    info_progress,
    info_project_management,
    info_project_update,
    info_projects,
    info_projects_sub,
    info_worker,
    pagelogs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
