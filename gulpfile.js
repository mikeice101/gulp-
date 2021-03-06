const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del'); /*Удаляет все файлы при обновление дериктории */
const browserSync = require('browser-sync').create(); //Подключение браузер синк
const cssFiles = [
'./node_modules/normalize.css/normalize.css', /*убирает дефолтные стили 
Нормализует стили для широкого диапазона элементов.
Исправляет ошибки и распространенные несоответствия браузера.
Повышает удобство использования за счет незначительных изменений */
'./src/css/**/*.css'
];
const jsFiles = [
	'./src/js/**/*.js'
]
function styles() {
	return gulp.src(cssFiles) /* две /** / значат что из всех
	 вложеных директорий тоже будет взяты css файлы */
	 .pipe(concat('all.css')) /* pipe() это команда к каждому действию 
	 в данном примере объединение 2 файлов css
	   порядок объединения можно задать, у предпроцессоров таких проблем нет*/
	   .pipe(autoprefixer({
	   		  overrideBrowserslist:['>0.1%'],
            cascade: false
        })) /* установит автопрефиксы для поддержки браузеров */
	   .pipe(cleanCSS({level:2})) /* Сжимает css файл(оптимизирует), убирает 
	   дублирующие свойства и объединяет их(группирует) lvl 2 степень сжатия*/
			.pipe(gulp.dest('./build/css'))
			.pipe(browserSync.stream()); // следит за изменением и обновляет страницу
}
function script() {
	return gulp.src(jsFiles)
	 .pipe(concat('all.js'))
	 .pipe(uglify({mangle: {
        toplevel: true
    }})) /*минифицирует js код */
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream()); // следит за изменением и обновляет страницу
}
function watch() {
	 browserSync.init({ // инициализируем синхронизацию
        server: {
            baseDir: "./" // в какой папке искать html файлы
        }
       // ,tunnel:true добавить тунель
    });

	gulp.watch('./src/css/**/*.css', styles); /*Следдит за изменениями*/
	gulp.watch('./src/js/**/*.js', script);
	gulp.watch('./*.html').on('change', browserSync.reload); // при изменение html перезагружает страницу
}
function clean() {
	return del(['build/*'])
}

// gulp.task('styles', styles); для отдельного запуска таска на сборку css
// gulp.task('script', script); 
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, /*Выполняет последовательно команду clean */
	gulp.parallel(styles,script)/* запустить 2 таска одновременно */
	));
gulp.task('dev',gulp.series('build','watch')); /* вызывается gulp dev он 
сначала запускает таск билд, а потом watch*/