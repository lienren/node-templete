/*
 * @Author: Lienren 
 * @Date: 2018-04-10 19:31:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-07 11:33:48
 */
'use strict';

const BMP24 = require('gd-bmp').BMP24;
const comm = require('./comm');

module.exports = {
  // 制造验证码图片
  makeCapcha: (
    code,
    bmpWidth = 100,
    bmpHeight = 40,
    {
      bgColor = 0x000000,
      fontColor = 0x000000,
      leftMargin = { base: 15, min: 2, max: 8 },
      topMargin = { base: 8, min: -10, max: 10 }
    }
  ) => {
    let img = new BMP24(bmpWidth, bmpHeight);
    img.fillRect(0, 0, img.w, img.h, bgColor);

    img.drawCircle(comm.rand(0, img.w), comm.rand(0, img.h), comm.rand(10, img.h), comm.rand(0, 0xffffff));

    img.fillRect(
      comm.rand(0, img.w),
      comm.rand(0, img.h),
      comm.rand(10, img.h),
      comm.rand(10, img.h),
      comm.rand(0, 0xffffff)
    );

    img.drawLine(
      comm.rand(0, img.w),
      comm.rand(0, img.h),
      comm.rand(0, img.w),
      comm.rand(0, img.h),
      comm.rand(0, 0xffffff)
    );

    //画曲线
    let w = img.w / 2;
    let h = img.h;
    let color = comm.rand(0, 0xffffff);
    let y1 = comm.rand(-5, 5); // Y轴位置调整
    let w2 = comm.rand(10, 15); // 数值越小频率越高
    let h3 = comm.rand(4, 6); // 数值越小幅度越大
    let bl = comm.rand(1, 5); // 曲线宽度
    for (let i = -w; i < w; i += 0.1) {
      let y = Math.floor((h / h3) * Math.sin(i / w2) + h / 2 + y1);
      let x = Math.floor(i + w);
      for (let j = 0; j < bl; j++) {
        img.drawPoint(x, y + j, color);
      }
    }

    // 画验证码
    let fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    let x = leftMargin.base;
    let y = topMargin.base;
    for (let i = 0; i < code.length; i++) {
      let f = fonts[(Math.random() * fonts.length) | 0];
      y = topMargin.base + comm.rand(topMargin.min, topMargin.max);
      img.drawChar(code[i], x, y, f, fontColor);
      x += f.w + comm.rand(leftMargin.min, leftMargin.max);
    }
    return img;
  }
};
