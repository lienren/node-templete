/*
 * @Author: Lienren 
 * @Date: 2021-01-25 00:24:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-13 22:01:21
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
  }
};