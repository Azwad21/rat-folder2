const chokidar = require('chokidar');
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const chalk = require('chalk');

chokidar.watch('./dist/app.bundle.js').on('all', (event, path) => {
  console.clear();
  console.log(chalk.yellow("Minifying..."));
  minify({
    compressor: uglifyES,
    input: './dist/app.bundle.js',
    output: './dist/app.bundle.minify.js',
    callback: function(err, min) {}
  });
  console.clear();
  console.log(chalk.green("Minified"));
});