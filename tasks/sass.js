var gulp = require('gulp'),
    _ = require('lodash'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    Logger = require('../Logger'),
    Piper = require('../Piper'),
    resolve = require('../PathResolver'),
    config;

var getSass = function () {
    var sassFiles = [];

    _.each(config.styles, function (file) {
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

    sourceFile = resolve(file.source);
    destFile = resolve(file.dest.path);

    process = gulp.src(sourceFile)
        .pipe(plumber());

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
    Logger.heading('Sass compilation');
    Logger.message('compiling ...');
    compileAll(getSass());
    Logger.info('Sass complete');
    return;
};

var task = function (configFile) {
    config = configFile;

    return sassTask;
};

module.exports = task;