const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ora = require('ora');

const colors = {
  red: s => `\x1b[31m${s}\x1b[39m`,
  gray: s => `\x1b[90m${s}\x1b[39m`,
  green: s => `\x1b[32m${s}\x1b[39m`
};

function loadOptions (args) {
  args.cwd = args.cwd || process.cwd();
  const name = args.config || 'up-config.js';
  const file = path.join(args.cwd, name);
  try {
    require.resolve(file);
  } catch (err) {
    return args;
  }
  const options = require(file);
  if (typeof options === 'function') {
    return options(args);
  } else {
    return Object.assign({}, args, options);
  }
}

function checksum (algorithm, file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(file);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

exports.runTask = async (list, tasks) => {
  if (!list || !list.length) return;
  for (const item of list) {
    const name = item.task;
    const fn = tasks[name];
    if (!fn) {
      throw new Error(`Task '${item.task}' not found.`);
    }
    const spin = ora(`Task → ${name}`).start();
    const actions = item.actions || [];
    const len = actions.length;
    for (let i = 0; i < len; i++) {
      spin.text = `Task → ${name} (${i + 1}/${len})`;
      await fn(actions[i]);
    }
    spin.succeed();
  }
  console.log();
};

exports.getEndPoint = (region) => {
  const map = {
    // 华东
    'qn:cn-east-1': {
      port: 443,
      region: 'cn-east-1',
      endPoint: 's3-cn-east-1.qiniucs.com'
    },
    // 华北
    'qn:cn-north-1': {
      port: 443,
      region: 'cn-north-1',
      endPoint: 's3-cn-north-1.qiniucs.com'
    },
    // 华南
    'qn:cn-south-1': {
      port: 443,
      region: 'cn-south-1',
      endPoint: 's3-cn-south-1.qiniucs.com'
    },
    // 北美
    'qn:us-north-1': {
      port: 443,
      region: 'us-north-1',
      endPoint: 's3-us-north-1.qiniucs.com'
    },
    // 东南亚
    'qn:ap-southeast-1': {
      port: 443,
      region: 'ap-southeast-1',
      endPoint: 's3-ap-southeast-1.qiniucs.com'
    }
  };
  if (map[region]) {
    return map[region];
  }
  return { region };
};

exports.colors = colors;
exports.checksum = checksum;
exports.loadOptions = loadOptions;

exports.defaultPrefix = (cwd) => {
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    if (pkg.name && pkg.version) {
      return `${pkg.name}/${pkg.version}`;
    }
    return '';
  }
};

exports.exists = async (client, bucket, object, file) => {
  try {
    const stat = await client.statObject(bucket, object);
    const hash = await checksum('md5', file);
    return stat.etag === hash;
  } catch (e) {
    return false;
  }
};
