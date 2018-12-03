/*eslint-env es6*/
const concat = require('gulp-concat');
const gulp = require('gulp');
const minify = require('gulp-minify');
const through = require('through2');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const { src, task } = require('gulp');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');

// PATHS

const distPath = './public/assets';
const jsDistPath = `${distPath}/js`;
const cssDistPath = `${distPath}/css/`;

const srcPath = './src';
const jsSrcPath = `${srcPath}/js`;
const scssSrcPath = `${srcPath}/scss`;

// JAVASCRIPT

const options = {
	ext: {
		min: '.js',
	},
	noSource: true,
};

let productionBuild = false;

let fileList = [];

gulp.task('single-js', function() {
	fileList = [];
	return gulp
		.src([`${jsSrcPath}/**/*.js`, `!${jsSrcPath}/template/**/*js`, `!${jsSrcPath}/bundle/**/*js`])
		.pipe(
			through.obj((chunk, enc, cb) => {
				fileList.push(chunk.path.split('/').pop());
				cb(null, chunk);
			})
		)
		.pipe(eslint())
		.pipe(sourcemaps.init())
		.pipe(gulpif(productionBuild, minify(options)))
		.pipe(sourcemaps.write('./maps'))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(gulp.dest(jsDistPath));
});

gulp.task('bundle-js', () =>
	gulp
		.src(`${jsSrcPath}/bundle/**/*js`)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(gulpif(productionBuild, minify(options)))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(jsDistPath))
);

gulp.task('sentinel-js', done => {
	if (fileList.length == 0) {
		console.error('Filelist empty - Cannot create Sentinel');
		done();
		return null;
	}
	const moduleNames = fileList.map(file => "'" + file.split('.')[0] + "'").join(',');

	return gulp
		.src(`${jsSrcPath}/template/sentinel.template.js`)
		.pipe(replace("'###MODULES###'", moduleNames))
		.pipe(sourcemaps.init())
		.pipe(gulpif(productionBuild, minify(options)))
		.pipe(
			rename(path => {
				path.basename = 'sentinel';
			})
		)
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(jsDistPath));
});

gulp.task('set-production', done => {
	productionBuild = true;
	done();
});

gulp.task('js', gulp.series('bundle-js', 'single-js', 'sentinel-js'));

gulp.task('build-js', gulp.series('set-production', 'js'));

// CSS

const browsers = ['>0.25%', 'not op_mini all'];

gulp.task('scss', () =>
	gulp
		.src(`${scssSrcPath}/**/*.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(
			autoprefixer({
				browsers,
				cascade: false,
			})
		)
		.pipe(
			gulpif(
				productionBuild,
				cssnano({
					filterPlugins: false,
					safe: true,
					mergeRules: false,
					browsers,
					svgo: false,
					discardComments: {
						removeAll: true,
					},
				})
			)
		)
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(cssDistPath))
);

gulp.task('build-css', gulp.series('set-production', 'scss'));

gulp.task('scss:watch', () => {
	gulp.watch(`${scssSrcPath}/**/*.scss`, gulp.series('scss'));
});

// GLOBAL

gulp.task('build', gulp.series('set-production', 'scss', 'js'));

gulp.task('default', () => {
	gulp.watch(
		[`${jsSrcPath}/**/*.js`, `!${jsSrcPath}/bundle/**/*js`],
		gulp.series('single-js', 'sentinel-js')
	);
	gulp.watch(`${jsSrcPath}/bundle/**/*.js`, gulp.series('bundle-js'));

	gulp.watch(`${scssSrcPath}/**/*.scss`, gulp.series('scss'));
});
