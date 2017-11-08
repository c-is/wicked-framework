const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const rimraf = require('rimraf');
const webpack = require('webpack');
const async = require('async');
const Browsersync = require('browser-sync');
const task = require('./task');
const config = require('./config');

global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)

// Build the app and launch it in a browser for testing via Browsersync
module.exports = task('run', () => new Promise((resolve) => {
  rimraf.sync('html/assets/*', { nosort: true, dot: true });
  let count = 0;
  const bs = Browsersync.create();
  const webpackConfig = require('./webpack.config');
  const compiler = webpack(webpackConfig);
  // Node.js middleware that compiles application in watch mode with HMR support
  // http://webpack.github.io/docs/webpack-dev-middleware.html
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats,
  });

  compiler.plugin('done', (stats) => {
    // Generate index.html page
    const dirPath = './src/template/pages/';
    const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
    // const template = fs.readFileSync(path.resolve(__dirname, '../src/template/pages'), 'utf8');
    
    fs.readdir(dirPath, (err, filesPath) => {
        if (err) throw err;
        filesPath = filesPath.map((filePath) => { //generating paths to file
            return dirPath + filePath;
        });
        async.map(filesPath, (filePath, cb) => { //reading files or dir
          if (filePath.indexOf('ejs') !== -1) {
            const template = fs.readFileSync(filePath, 'utf8');
            const render = ejs.compile(template);
            let fileName = filePath.replace(dirPath, '');
            fileName = fileName.replace('ejs', 'html');
            const output = render({ debug: true, bundle: `/assets/${bundle}`, config });
            fs.writeFileSync('./html/' + fileName, output, 'utf8');
          }
        }, (err, results) => {
            console.log(results); //this is state when all files are completely read
            res.send(results); //sending all data to client
        });
    });

    // Launch Browsersync after the initial bundling is complete
    // For more information visit https://browsersync.io/docs/options
    count += 1;
    if (count === 1) {
      bs.init({
        port: process.env.PORT || 3000,
        ui: { port: Number(process.env.PORT || 3000) + 1 },
        server: {
          baseDir: 'html',
          middleware: [
            webpackDevMiddleware,
            require('webpack-hot-middleware')(compiler),
            require('connect-history-api-fallback')(),
          ],
        },
      }, resolve);
    }
  });
}));
