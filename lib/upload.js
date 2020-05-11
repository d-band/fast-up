const path = require('path');
const ora = require('ora');
const mfs = require('micro-fs');
const Minio = require('minio');
const {
  defaultPrefix, exists, colors, getEndPoint
} = require('./utils');

module.exports = async (options) => {
  // Options
  const cwd = options.cwd || process.cwd();
  const base = options.base;
  const dist = options.dist || './dist/**';
  const prefix = options.prefix || defaultPrefix(cwd);
  const bucket = options.bucket;
  // Create client
  const client = new Minio.Client({
    useSSL: true,
    port: parseInt(options.port) || 443,
    endPoint: options.host,
    accessKey: options.accessKey,
    secretKey: options.secretKey,
    ...getEndPoint(options.region),
    ...options.client
  });
  const files = await mfs.glob(dist, {
    cwd, base, nodir: true
  });

  let count = 0;
  for (const file of files) {
    const relative = path.relative(file.base, file.path);
    const dest = path.join(prefix, relative);
    const spin = ora(`Upload → ${dest}`).start();
    const skip = await exists(client, bucket, dest, file.path);
    if (skip) {
      spin.info(`Skip → ${colors.gray(dest)}`).stop();
      continue;
    }
    try {
      if (!options.dryRun) {
        await client.fPutObject(bucket, dest, file.path, {});
      }
      count++;
      spin.succeed(`Done → ${colors.green(dest)}`).stop();
    } catch (e) {
      spin.fail(`Fail → ${colors.red(dest)}`).stop();
      console.error(e);
    }
  }
  const done = `${count}/${files.length}`;
  console.log(`  Total → ${colors.green(done)}\n`);
};
