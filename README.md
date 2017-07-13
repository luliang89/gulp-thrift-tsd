#gulp-thrift-tsd

本工具是一个Gulp插件。
Thrift编译命令`-gen js,ts`生成的tsd只能用于浏览器环境，使用本工具可以批量转换成Nodejs端使用的tsd。

## 安装

```
$ npm install gulp-thrift-tsd
```

##示例

```js
var
    gulp = require('gulp'),
    tsd = require('gulp-thrift-tsd'),
    concat = require('gulp-concat'),
    through = require('through2')
    ;

function addModule() {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb();
            return;
        }
        var before = new Buffer('declare module "local-thriftdef" {\r\n');
        var after = new Buffer('\r\n}');
        file.contents = Buffer.concat([before, file.contents, after]);
        this.push(file);
        cb();
    });
}


gulp.task('tsd', function () {
    return gulp.src(['./node_modules/local-thriftdef/lib/*.d.ts'
        , '!./node_modules/local-thriftdef/lib/exception_types.d.ts'])
        .pipe(tsd())
        .pipe(concat('local-thriftdef.d.ts')) //合并成一个文件
        .pipe(addModule()) //添加顶级模块声明
        .pipe(gulp.dest('./'))
        ;
});
```

## License

MIT