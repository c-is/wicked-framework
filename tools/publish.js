/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// const path = require('path');
// const firebase = require('firebase-tools');
// const build = require('./build');
// const task = require('./task');
// const config = require('./config');

// // Build and deploy the app to Firebase
// module.exports = task('deploy', () => Promise.resolve()
//   .then(() => build())
//   .then(() => firebase.login({ nonInteractive: false }))
//   .then(() => firebase.deploy({
//     project: config.project,
//     cwd: path.resolve(__dirname, '../'),
//   }))
//   .then(() => { setTimeout(() => process.exit()); }));

const task = require('./task');
const s3 = require('s3');

// deploy the app to Firebase
global.DEBUG = process.argv.includes('--debug') || false;

module.exports = task('publish', () => new Promise((resolve, reject) => {
  const client = s3.createClient({
    s3Options: {
      region: 'eu-west-1',
      sslEnabled: true,
    },
  });
  const uploader = client.uploadDir({
    localDir: 'public',
    deleteRemoved: true,
    s3Params: { Bucket: 'worlder.co' },
  });
  uploader.on('error', reject);
  uploader.on('end', resolve);
}));
