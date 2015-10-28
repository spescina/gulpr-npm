var gulp = require('gulp'),
    path = require('path'),
    _ = require('lodash'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    Logger = require('../Logger'),
    Piper = require('../Piper');

var config;

var getSass = function () {
    var sassFiles = [];

    _.each(config['styles'], function (file) {
        sassFiles.push.apply(sassFiles, _.filter(file.files, function (item) {
            return (typeof item === 'object') && (item.type === 'sass')
        }));
    });

    return sassFiles;
};

var compileAll = function (files) {
    _.each(files, function (file) {
        compile(file);
    });
};

var compile = function (file) {
    var process, piper, sourceFile, destFile,
        withSourcemap, withAutoprefixer;

    withSourcemap = file.options.sourcemap.enabled ? file.options.sourcemap.enabled : false;
    withAutoprefixer = file.options.autoprefixer.enabled ? file.options.autoprefixer.enabled : false;

    sourceFile = path.join(config.base, file.source);
    destFile = path.join(config.base, file.dest.path);

    Logger.files(sourceFile, false);

    Logger.message('Sourcemap enabled? ' + withSourcemap);
    Logger.message('Autoprefixer enabled? ' + withAutoprefixer);

    process = gulp.src(sourceFile).on('error', function (err) {
        console.error('Error!', err.message);
    });

    piper = new Piper(process);

    if (withSourcemap) {
        piper.pipe(sourcemaps.init());
    }

    piper.pipe(sass({style: 'expanded'}));

    if (withAutoprefixer) {
        piper.pipe(autoprefixer({
            cascade: false,
            browsers: file.options.autoprefixer.browsers ? file.options.autoprefixer.browsers : ['last 3 versions']
        }));
    }

    if (withSourcemap) {
        piper.pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: file.options.sourcemap.sourceRoot
        }));
    }

    return piper.pipe(gulp.dest(destFile));
};

var sassTask = function () {
    Logger.heading('Compiling SASS files ...');

    return compileAll(getSass());
};

var task = function (configFile) {
    config = configFile;

    return sassTask;
};

module.exports = task;