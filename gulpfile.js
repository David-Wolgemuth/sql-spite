
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var mocha = require("gulp-mocha");

gulp.task("default", function () {
    gulp.watch(["./src/**/*.ts", "./test/**/*.js"], ["compile:test"]);
});

gulp.task("compile", function () {
    return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest("./dist"))
    .on("error", swallowError);
});

gulp.task("compile:test", ["compile"], function () {
    gulp.src("./test/**/*.test.js")
    .pipe(mocha().on("error", swallowError));
});

function swallowError (error) {
    console.log("WHOOOPS", error.toString());
    this.emit("end");
}
