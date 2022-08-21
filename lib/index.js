'use strict';

const fs    = require('fs');
const utils   = require('./utils');
const util  = require('util');
const pread = util.promisify(fs.read);

exports.detect = function (buffer) {
  return utils.ascii(buffer, 1, 8) === 'PNG\r\n\x1a\n' && utils.ascii(buffer, 12, 16) === 'IHDR';
};

exports.measure = async function (path, fd) {
  return pread(fd, Buffer.alloc(8), 0, 8, 16)
    .then((readObject) => {
      return {
        type: 'png',
        pages: [{
          width: readObject.buffer.readUInt32BE(0),
          height: readObject.buffer.readUInt32BE(4)
        }]
      };
    });
};
