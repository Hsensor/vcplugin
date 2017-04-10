/*
* gulp 执行task是并行执行(任务同时执行)
*添加gulp-sequence让任务串行执行，[a,b][中的任务并行执行，同时执行]
*/

var mainBowerFiles = require('main-bower-files');
var del = require('del');
var path = require('path');
var gulp = require('gulp');

var rename = require("gulp-rename");
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');

var gulpSequence = require('gulp-sequence');
var inject = require("gulp-inject");

var env = process.env.NODE_ENV;

//----------------js  start---------------
gulp.task("clean_assets_js",function(){
    del([path.join(__dirname, "/assets/js/*")]);
    del([path.join(__dirname,"/../webapp/assets/js/*")],{force:true});
});
gulp.task("clean_resources_js",function(){
    del([path.join(__dirname,"/../webapp/resources/js/*")],{force:true});
});
gulp.task("copyJs",function(){
    return gulp.src(mainBowerFiles({'debugging':true}))
    .pipe(gulp.dest(__dirname+'/assets/js'));
});


/*
gulp.task("targetAssetsJs",function(){
    if (env==="development") {
        return gulp.src(__dirname+"/assets/js/require.js")
        .pipe(gulp.dest(__dirname+'/../webapp/assets/js'));
    } else {
        return gulp.src(__dirname+"/assets/js/require.js")
        .pipe(uglify())
        .pipe(gulp.dest(__dirname+'/../webapp/assets/js'));
    }
});

gulp.task("targetResourceJs",function(){
    if (env==="development") {
        return gulp.src(__dirname+"/resources/main.js")
        .pipe(gulp.dest(__dirname+"/../webapp/resources/"))
    } else {
        return gulp.src(__dirname+"/resources/main.js")
        .pipe(uglify())
        .pipe(gulp.dest(__dirname+"/../webapp/resources/"))
    }
});
*/

gulp.task("targetAssetsJs",function(){
    if (env==="development") {
        return gulp.src(__dirname+"/assets/js/*")
        .pipe(gulp.dest(__dirname+'/../webapp/assets/js'));
    } else {
        return gulp.src(__dirname+"/assets/js/*")
        .pipe(uglify())
        .pipe(gulp.dest(__dirname+'/../webapp/assets/js'));
    }
});

gulp.task("targetResourceJs",function(){
    if (env==="development") {
        return gulp.src(__dirname+"/resources/js/*")
        .pipe(gulp.dest(__dirname+"/../webapp/resources/js"))
    } else {
        return gulp.src(__dirname+"/resources/js/*")
        .pipe(uglify())
        .pipe(gulp.dest(__dirname+"/../webapp/resources/js"))
    }
});

gulp.task("targetResource",function(){
    if (env==="development") {
        return gulp.src(__dirname+"/resources/*.js")
        .pipe(gulp.dest(__dirname+"/../webapp/resources"))
    } else {
        return gulp.src(__dirname+"/resources/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(__dirname+"/../webapp/resources"))
    }
});
//----------------js  end---------------

//---------------html start ------------
gulp.task("clean_resources_html",function(){
    del([__dirname+"/../webapp/resources/*"],{force:true});
})

//---------------html end --------------

//---------------css  start ------------
gulp.task("clean_assets_css",function(){
    del([__dirname+"/../webapp/assets/css"],{force:true})
})
gulp.task("targetAssetsCss",function(){
    gulp.src([__dirname+"/bower_components/bootstrap/dist/css/bootstrap.css",__dirname+"/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css",__dirname+"/assets/css/*.css"])
    .pipe(concat("index.css"))
    .pipe(minifyCss())
    .pipe(gulp.dest(__dirname+"/../webapp/assets/css"));
})
//---------------css  end --------------

//---------------images start ----------
gulp.task("clean_assets_images",function(){
    del([__dirname+"/../webapp/assets/images/*"],{force:true});
})
gulp.task("target_assets_images",function(){
    gulp.src(__dirname+"/assets/images/*")
    .pipe(gulp.dest(__dirname+"/../webapp/assets/images/"));
})
//---------------images end ------------

//---------------fonts start ----------
gulp.task("clean_assets_fonts",function(){
    del([__dirname+"/../webapp/assets/fonts/*"],{force:true});
})
gulp.task("target_assets_fonts",function(){
    gulp.src([__dirname+"/bower_components/bootstrap/dist/fonts/*",__dirname+"/assets/fonts/*"])
    .pipe(gulp.dest(__dirname+"/../webapp/assets/fonts/"));
})
//---------------fonts end ------------

gulp.task("r",function(){
    require("child_process").spawn(process.execPath,["r.js", "-o", "build.js"]);
})

gulp.task("inject",function(){
    if (env === "development") {
        return gulp.src(__dirname+"/resources/index.html").pipe(
            inject(gulp.src([__dirname+"/resources/dev.js"]), {
                starttag: '<!--inject:js-->',
                transform : function (filePath, file) {
                    return '<script type="text/javascript" src="/vsphere-client/h2000'+filePath+'"></script>';
                }
            })
        )
        .pipe(minifyHtml())
        .pipe(gulp.dest(__dirname+"/../webapp/resources"))
    }else {
        return gulp.src(__dirname+"/resources/index.html").pipe(
            inject(gulp.src([__dirname+"/resources/prod.js"]), {
                starttag: '<!--inject:js-->',
                transform : function (filePath, file) {
                    return '<script type="text/javascript" src="/vsphere-client/h2000'+filePath+'"></script>';
                }
            })
        )
        .pipe(minifyHtml())
        .pipe(gulp.dest(__dirname+"/../webapp/resources"))
    }
})

gulp.task("default",gulpSequence(
    [
        "clean_assets_js","clean_resources_js",
        "clean_assets_css","clean_resources_html",
        "clean_assets_images","clean_assets_fonts"
    ],
    [
        "copyJs"
    ],
    [
        "r"
    ],
    [
        "inject"
    ],
    [
        "targetAssetsJs","targetResourceJs","targetResource",
        "targetAssetsCss","target_assets_images","target_assets_fonts"
    ]
))
