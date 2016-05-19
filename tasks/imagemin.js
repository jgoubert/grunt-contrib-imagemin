'use strict';
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var async = require('async');
const Imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
//const imageminMozjpeg = require('imagemin-mozjpeg');
//const imageminPngquant = require('imagemin-pngquant');

/*
 * grunt-contrib-imagemin
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    grunt.registerMultiTask('imagemin', 'Minify PNG, JPEG, GIF and SVG images', function () {
        var files = this.files;
        var finalDest = {};
        var options = this.options({
            interlaced: true,
            optimizationLevel: 3,
            progressive: true
        });

        var done = this.async();
        setTimeout(function() {
            //equivalent to running grunt foo bar on the cli
            var processed = 0;
            for (var i = 0; i <= files.length - 1; i++) {
                finalDest[path.resolve(path.dirname(files[i].dest),files[i].src[0])] = files[i].dest;
                Imagemin([files[i].src[0]], path.dirname(files[i].dest), {
                  plugins: [
                    imageminJpegtran(options),
                    imageminOptipng(options)
                    //add gif, svg if needed
                  ]
                }).then(data => {
                    fs.rename(data[0].path, finalDest[data[0].path]);
                    grunt.verbose.writeln(chalk.green('✔ ') + finalDest[data[0].path]);
                    processed++;
                    if(processed === files.length) {
                        done();
                    }
                }, function(err) {
                    grunt.warn(err);
                });
            }
            
        });

    });
};
