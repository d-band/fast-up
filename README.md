fast-up
=======

> Uploads compiled assets to Amazon S3

[![NPM version](https://img.shields.io/npm/v/fast-up.svg)](https://www.npmjs.com/package/fast-up)
[![NPM downloads](https://img.shields.io/npm/dm/fast-up.svg)](https://www.npmjs.com/package/fast-up)
[![Dependency Status](https://david-dm.org/d-band/fast-up.svg)](https://david-dm.org/d-band/fast-up)
[![Greenkeeper badge](https://badges.greenkeeper.io/d-band/fast-up.svg)](https://greenkeeper.io/)

---

## Install

```bash
$ npm install fast-up -D
```

## Usage

```bash
$ up -h

Usage: up [options]

Options:
  -v, --version                output the version number
  -c, --config [config]        config file path (default: "up-config.js")
  -d, --dist [dist]            upload files glob patten (default: "./dist/**")
  -b, --bucket [bucket]        S3 bucket name
  -r, --region [region]        S3 region name
  -a, --accessKey [accessKey]  S3 client accessKey
  -s, --secretKey [secretKey]  S3 client secretKey
  --port [port]                S3 endpoint port
  --host [host]                S3 endpoint host
  --base [base]                base path for dist
  --prefix [prefix]            object path prefix
  -h, --help                   output usage information

$ up --region=qn:cn-east-1 --bucket=test --accessKey=$AK --secretKey=$SK
```

## Config

> Default config file is  `up-config.json` or `up-config.js`

```js
// up-config.js
module.exports = {
  region: 'qn:cn-east-1',
  bucket: 'bucketName',
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  before: [{
    task: 'copy',
    actions: [{
      src: 'lib/**',
      dest: 'dist',
      base: '.'
    }]
  }],
  after: [{
    task: 'delete',
    actions: [{
      src: 'dist/**'
    }]
  }]
};
```

## Report a issue

* [All issues](https://github.com/d-band/fast-up/issues)
* [New issue](https://github.com/d-band/fast-up/issues/new)

## License

fast-up is available under the terms of the MIT License.
