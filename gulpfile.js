
var $ = require('gulp-load-plugins')(),
	gulp = require('gulp'),
	map = require('map-stream'),
	webpack = require('webpack-stream'),
	Karma = require('karma').Server,
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish');

var env = require('./config/env.js');

var server;

gulp.task('demo', function() {
	return gulp.src(env.jsSrc)
	.pipe(webpack({
		entry: './'+env.demoConfig,
		module: {
			loaders: [{
				test: /\.js$/,
				loader: "babel-loader",
				query: {
					presets: ['env']
					}
			}],
		},
		output: {
			filename: 'demo.js',
			library: env.library,
			libraryTarget: "var"
		}
	}))
	.pipe(gulp.dest(env.demoDir));
});

gulp.task('library', function() {
	return gulp.src(env.jsDemo)
	.pipe(webpack({
		entry: './'+env.libraryConfig,
		module: {
			loaders: [{
				test: /\.js$/,
				loader: "babel-loader",
				query: {
				presets: ['env']
				}
			}],
		},
		output: {
			filename: env.name+'.js',
			library: env.library,
			libraryTarget: "var"
		},
		externals: env.externals
	}))
	.pipe(gulp.dest(env.distDir));
});

gulp.task('test-ie', ['build','test-server'], function( done ) {
	new Karma({
		configFile: __dirname +'/'+ env.karmaConfig,
		browsers: ['IE']
	}, function(){
		done();
	}).start();
});

var failOnError = function() {
    return map(function(file, cb) {
        if (!file.jshint.success) {
            process.exit(1);
        }
        cb(null, file);
    });
};

function test(){
	return gulp.src( env.jsSrc.map((d) => d.replace('!','')) )
    .pipe( jshint() )
    .pipe( jshint.reporter(stylish) );
}

gulp.task('build-lint', function() {
    return test().pipe( failOnError() );
});

gulp.task('lint', function() {
   return test();
});

gulp.task('build', ['build-lint', 'demo','library'] );

gulp.task('test-noexit', ['build'], function( done ) {
	new Karma({
		configFile: __dirname +'/'+ env.karmaConfig
	},function(){
		done();
	}).start();
});

gulp.task('test', ['test-noexit'], function() {
	process.exit();
});

gulp.task('watch', ['build'], function(){
	gulp.watch(env.jsSrc.concat(['./'+env.demoConfig]), ['lint', 'demo','library']);
});

gulp.task('serve', ['watch','test-noexit'], function() {
	gulp.src(env.demoDir)
		.pipe($.webserver({
			port: 9000,
			host: 'localhost',
			fallback: 'index.html',
			livereload: true,
			open: true
		}))
});
