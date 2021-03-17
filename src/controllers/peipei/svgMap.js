/*
 * @Author: Lienren 
 * @Date: 2021-01-25 00:24:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-17 22:37:01
 */

const fs = require('fs');
const path = require('path');
const natural = require('natural');

var list = [];

function listFile(dir, dirName, fileNames) {
  let arr = fs.readdirSync(dir);

  arr.forEach(function (item) {
    let fullpath = path.join(dir, item);
    let stats = fs.statSync(fullpath);

    if (stats.isDirectory()) {
      listFile(fullpath, item, fileNames);
    } else {
      if (fileNames.indexOf(item.split('.')[0]) < 1) {
        list.push({
          dir: dirName,
          svg: item.split('.')[0],
          xml: item.split('.')[0],
          is_del: 0
        });
        fileNames += item;
      }
    }
  });

  return list;
}


module.exports = {
  search: async ctx => {
    let searchValue = ctx.request.body.searchValue || '';

    if (searchValue) {
      let svgs = await ctx.orm().svg_maps.findAll({
        where: {
          is_del: 0
        }
      });

      svgs = svgs.map(m => {
        return {
          ...m.dataValues
        }
      });

      svgs = svgs.reduce((total, current) => {
        if (total[current.dir]) {
          total[current.dir].push({
            id: current.id,
            dir: current.dir,
            svg: current.svg,
            xml: current.xml
          })
        } else {
          total[current.dir] = [];
          total[current.dir].push({
            id: current.id,
            dir: current.dir,
            svg: current.svg,
            xml: current.xml
          })
        }

        return total;
      }, {});

      let hits = [];
      let hotHists = [];
      let dirs = Object.keys(svgs);

      for (let i = 0, j = dirs.length; i < j; i++) {
        if (searchValue.indexOf(dirs[i]) >= 0 && searchValue !== dirs[i]) {
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            if (searchValue.indexOf(svgs[dirs[i]][x].svg) >= 0) {
              hits.unshift({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
              })
              break;
            } else if (natural.JaroWinklerDistance(searchValue, svgs[dirs[i]][x].svg) >= 0.45) {
              hotHists.push({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg,
                hot: natural.JaroWinklerDistance(searchValue, svgs[dirs[i]][x].svg)
              })
            }
          }
          break;
        } else if (dirs[i].indexOf(searchValue) >= 0) {
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            hits.unshift({
              ...svgs[dirs[i]][x],
              title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
            })
          }
          break;
        } else {
          // 如果找不到，则通过关键字找地图
          for (let x = 0, y = svgs[dirs[i]].length; x < y; x++) {
            if (svgs[dirs[i]][x].svg.indexOf(searchValue) >= 0) {
              hits.unshift({
                ...svgs[dirs[i]][x],
                title: svgs[dirs[i]][x].dir + '/' + svgs[dirs[i]][x].svg
              })
            }
          }
        }
      }

      if (hotHists.length > 0) {
        hotHists = hotHists.sort((a, b) => {
          return b.hot - a.hot
        })
        hotHists.map(m => {
          hits.push({
            ...m
          })
        })
      }

      ctx.orm().svg_search.create({
        search_value: searchValue,
        manage_name: ctx.work.managerRealName,
      });

      ctx.body = hits;
    } else {
      ctx.body = [];
    }
  },
  searchHistory: async ctx => {
    let managerRealName = ctx.work.managerRealName;

    let result = await ctx.orm().svg_search.findAll({
      group: 'search_value',
      where: {
        manage_name: managerRealName
      },
      order: [
        ['id', 'desc']
      ],
      limit: 20
    })

    ctx.body = result.map(m => {
      return {
        search_value: m.dataValues.search_value
      }
    });
  },
  scanning: async ctx => {
    let root = '/Users/lienren/Downloads/Compressed/jquery.panzoom-master/demo/docs'

    let items = listFile(root, '', '');
    console.log('items:', items);
    ctx.orm().svg_maps.bulkCreate(items);

    ctx.body = {}
  },
  searchGps: async ctx => {
    let searchValue = ctx.request.body.searchValue || '';

    let where = {};
    if (searchValue) {
      where.title = {
        $like: `%${searchValue}%`
      }
    }

    let result = await ctx.orm().gps_maps.findAll({
      where
    });

    ctx.body = result;
  },
  getGps: async ctx => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().gps_maps.findOne({
      where: {
        id
      }
    });

    ctx.body = result;
  },
  editGps: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let a1 = ctx.request.body.a1 || '';
    let a2 = ctx.request.body.a2 || '';
    let a3 = ctx.request.body.a3 || '';
    let a4 = ctx.request.body.a4 || '';
    let a5 = ctx.request.body.a5 || '';
    let a6 = ctx.request.body.a6 || '';
    let a7 = ctx.request.body.a7 || '';
    let latitude = ctx.request.body.latitude || '';
    let longitude = ctx.request.body.longitude || '';

    await ctx.orm().gps_maps.update({
      title,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      latitude,
      longitude
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  getCheckPerson: async ctx => {
    let id = ctx.request.body.id || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id
      }
    });
    
    ctx.body = {
      isCheckPerson: admin.isCheckPerson > 0
    }
  }
};