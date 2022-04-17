const OSS = require('ali-oss')

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI5tG2ok5rhyApfQgTG82V',
  accessKeySecret: 'wSSpgspUvYKj7D0UESgDsPSWC6T1Oj',
  bucket: 'mallbigimages',
});

module.exports = {
  client
};
