var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    stylus = require('gulp-stylus'),
    cache = require('gulp-cache'),
    spritesmith = require("gulp.spritesmith"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    newer = require("gulp-newer"),
    bourbon = require('node-bourbon'),
    autoprefixer = require('gulp-autoprefixer');

// Работа с Sass
gulp.task('sass', function() {
    return gulp.src(['app/static/sass/**/*.sass', '!app/static/sass/_*.sass'])
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        // .pipe(cleanCSS())
        .pipe(gulp.dest('app/static/css'))
        .pipe(browsersync.reload({stream: true}))
});

// Работа со Stylus
// gulp.task('stylus', function() {
//     return gulp.src([
//             'app/static/stylus/main.styl',
//         ])
//         .pipe(plumber())
//         .pipe(stylus({
//             'include css': true
//         }))


//     .on("error", notify.onError(function(error) {
//             return "Message to the notifier: " + error.message;
//         }))
//         .pipe(autoprefixer(['last 2 version']))
//         .pipe(gulp.dest('app/static/css'))
//         .pipe(browsersync.reload({
//             stream: true
//         }));
// });

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('app/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('app'));
});

// Browsersync
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: 'app'
        },
    });
});

// Работа с JS
gulp.task('scripts', function() {
    return gulp.src([
            // Библиотеки
            'app/static/libs/jquery/jquery.min.js',
            'app/static/libs/magnific/jquery.magnific-popup.min.js',
            // 'app/static/libs/bxslider/jquery.bxslider.min.js',
            'app/static/libs/maskedinput/maskedinput.js',
            'app/static/libs/slick/slick.min.js',
            'app/static/libs/validate/jquery.validate.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/static/js'))
        .pipe(browsersync.reload({
            stream: true
        }));
});


// Сборка спрайтов PNG
gulp.task('cleansprite', function() {
    return del.sync('app/static/img/sprite/sprite.png');
});


gulp.task('spritemade', function() {
    var spriteData =
        gulp.src('app/static/img/sprite/*.*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.styl',
            padding: 15,
            cssFormat: 'stylus',
            algorithm: 'binary-tree',
            cssTemplate: 'stylus.template.mustache',
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name;
            }
        }));

    spriteData.img.pipe(gulp.dest('app/static/img/sprite/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/static/stylus/')); // путь, куда сохраняем стили
});
gulp.task('sprite', ['cleansprite', 'spritemade']);
// Слежение
gulp.task('watch', ['browsersync', 'sass', 'scripts'], function() {
    gulp.watch('app/static/sass/**/*.sass', ['sass']);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('app/*.html', browsersync.reload);
    gulp.watch(['app/static/js/*.js', '!app/static/js/libs.min.js', '!app/static/js/jquery.js'], ['scripts']);
});

// Очистка папки сборки
gulp.task('clean', function() {
    return del.sync('prodact');
});

// Оптимизация изображений
gulp.task('img', function() {
    return gulp.src(['app/static/img/**/*', '!app/static/img/sprite/*'])
        .pipe(cache(imagemin({
            progressive: true,
            use: [pngquant()]

        })))
        .pipe(gulp.dest('dist/static/img'));
});

// Сборка проекта

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var buildCss = gulp.src('app/static/css/*.css')
        .pipe(gulp.dest('dist/static/css'));

    var buildFonts = gulp.src('app/static/fonts/**/*')
        .pipe(gulp.dest('dist/static/fonts'));

    var buildJs = gulp.src('app/static/js/**.js')
        .pipe(gulp.dest('dist/static/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));

    var buildImg = gulp.src('app/static/img/sprite/sprite.png')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/static/img/sprite/'));
});

// Очистка кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

// Дефолтный таск
gulp.task('default', ['watch']);
