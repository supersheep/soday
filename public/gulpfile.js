var gulp = require("gulp");
var jade = require("gulp-jade");
var stylus = require("gulp-stylus");


process.on("uncaughtException",function(err){
    console.log(err);
});

gulp.task('stylus', function(){
    gulp.src(["./css/*.styl"])
        .pipe(stylus({
            paths: ['./css']
        }))
        .pipe(gulp.dest('./css/'));

});

gulp.task('jade', function(){
    gulp.src(["./jade/**/*.jade","!./jade/*layout.jade"])
        .pipe(jade())
        .pipe(gulp.dest("./html/"))
});


gulp.task('watch', function () {
    gulp.watch(["./jade/**/*.jade"], ['jade']);
    gulp.watch(["./css/**/*.styl"], ['stylus']);
});

gulp.task('default', ['stylus','jade','watch']);