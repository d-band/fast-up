const ora = require('ora');
const mfs = require('micro-fs');
const upload = require('./upload');
const { loadOptions, runTask } = require('./utils');

module.exports = async (options) => {
  options = loadOptions(options);
  const tasks = {
    ...options.tasks,
    upload,
    copy: opts => mfs.copy(opts.src, opts.dest, opts),
    move: opts => mfs.move(opts.src, opts.dest, opts),
    delete: opts => mfs.delete(opts.src, opts),
    archive: opts => mfs.archive(opts.src, opts.dest, opts)
  };
  await runTask(options.before, tasks);
  await upload(options);
  await runTask(options.after, tasks);
};

module.exports.mfs = mfs;
module.exports.ora = ora;
module.exports.upload = upload;
