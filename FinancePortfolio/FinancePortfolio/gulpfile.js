/// <binding BeforeBuild='sass' />
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    del = require("del"),
    sass = require("gulp-sass"),
    bundleconfig = require("./bundleconfig.json");

var paths = {
    scss: 'wwwroot/scss/'
};

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};


gulp.task("sass", function() {
    return gulp.src(paths.scss + '**/*.scss', ['!_variables.scss'])
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'));
});

gulp.task("min:js", function() {
    var tasks = getBundles(regex.js).map(function(bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("min:css", function() {
    var tasks = getBundles(regex.css).map(function(bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("clean", function() {
    var files = bundleconfig.map(function(bundle) {
        return bundle.outputFileName;
    });

    return del(files);
});

function getBundles(regexPattern) {
    return bundleconfig.filter(function(bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

gulp.task("min", gulp.series("clean", "sass", "min:js", "min:css"));