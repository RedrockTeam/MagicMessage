'use strict';

require("babel-polyfill")

// var dir =  __dirname + '/node_modules/'
// set babel in entry file
require('babel-core/register');

var fs = require('fs')

module.exports = function (entry) {
  var current_path = process.cwd();
  var f = current_path + '/bin/www'
  if (entry){
    f = entry
  }
  var is_exist = fs.existsSync(f)

  if (is_exist === false) {
    return console.log('runkoa entry file is not exist, please check it');
  }

  require(f) // this is es7 - gets transpile
}
