//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    tinypng = require('gulp-tinypng'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    config = require('./config.json');

//定义一个testLess任务（自定义任务名称）
gulp.task('Less', function () {
    gulp.src('src/less/*.less') //该任务针对的文件
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('./src/css')) //将会在src/css下生成index.css
        .pipe(connect.reload());
});

//压缩javascript 文件，压缩后文件放入build/js下 ,//合并build/js文件夹下的所有javascript 文件为一个main.js放入build/js下   
gulp.task('buildJS',function(){
    gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/min'));
    gulp.src('./src/js/min/*.js')
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./src/js/main'))
    .pipe(connect.reload());
});


// gulp.task('alljs', function() {
//   return gulp.src('./src/js/min/*.js')
//     .pipe(concat('main.min.js'))
//     .pipe(gulp.dest('./src/js/main'))
//     .pipe(connect.reload());
// });

//重命名project.md 文件
gulp.task('rename', function() {
  return gulp.src("./Project.md")
      .pipe(rename("README.md"))
      .pipe(gulp.dest("./assets"));
});

//将相关项目文件复制到build 文件夹下
gulp.task('buildfiles', function() {
   //根目录文件
   gulp.src('./src/*.{php,html,css,png}')
   .pipe(gulp.dest('./assets'));
   //CSS文件
   gulp.src('./src/css/*')
   .pipe(gulp.dest('./assets/css'));
    //图片文件
   gulp.src('./src/images/*')
   .pipe(gulp.dest('./assets/images'));
   gulp.src('./src/js/main/*')
   .pipe(gulp.dest('./assets/js'));
});

//压缩图片 - tinypng
// gulp.task('tinypng', function () {
//     gulp.src('images/*.{png,jpg,jpeg}')
//         .pipe(tinypng(config.tinypngapi))
//         .pipe(gulp.dest('./build/images'));
// });
gulp.task('HTML', function () {
  gulp.src('src/*.html')
    .pipe(connect.reload());
});
gulp.task('Watch', function () {
    gulp.watch('src/less/*.less', ['Less']); 
    gulp.watch('src/*.html', ['HTML']);
    gulp.watch('src/js/*.js', ['buildJS']); 
});
//开启服务
gulp.task('connect', function() {
  connect.server({
    root: 'src',
    livereload: true
  });
});
//默认任务
gulp.task('default', function(){
	console.log('Starting Gulp tasks, enjoy coding!');
	gulp.run('Less');
  	gulp.run('Watch');
	gulp.run('buildJS');
	// gulp.run('alljs');
	gulp.run('rename');
    gulp.run('connect');
	// gulp.run('tinypng');
});
gulp.task('build', function(){
    console.log('Starting build tasks!');
    gulp.run('buildfiles');
});
