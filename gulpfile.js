const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('module', () => {
	gulp.src([
			'./src/dl-animate-module.js',
			'./src/dl-animate-class.js'
		])
		.pipe(concat('dl-animate-module.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('es5-class', () => {
	gulp.src(['./src/dl-animate-class.js'])
		.pipe(babel({
            presets: ['env', 'es2015']
        }))
        .pipe(concat('dl-animate-class-es5.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('simple', ['es5-class'], () => {
	gulp.src([
			'./src/dl-animate-instance-start.js',
			'./dist/dl-animate-class-es5.js', 
			'./src/dl-animate-instance-end.js'
		])
		.pipe(concat('dl-animate.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build', ['module', 'simple'], () => {
	
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.js', ['build']);
});