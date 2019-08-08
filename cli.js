#!/usr/bin/env node

const program = require('commander');

program
  .version(require('./package').version, '-v, --version')
  .option('-c, --config [config]', 'config file path', 'up-config.js')
  .option('-d, --dist [dist]', 'upload files glob patten', './dist/**')
  .option('-b, --bucket [bucket]', 'S3 bucket name')
  .option('-r, --region [region]', 'S3 region name')
  .option('-a, --accessKey [accessKey]', 'S3 client accessKey')
  .option('-s, --secretKey [secretKey]', 'S3 client secretKey')
  .option('--port [port]', 'S3 endpoint port')
  .option('--host [host]', 'S3 endpoint host')
  .option('--base [base]', 'base path for dist')
  .option('--prefix [prefix]', 'object path prefix')
  .parse(process.argv);

require('./lib')(program).then(() => {
  console.log('Done.');
  process.exit();
}).catch(e => {
  console.log('Fail.');
  console.error(e);
  process.exit(1);
});
