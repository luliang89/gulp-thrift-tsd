var assert = require('assert');
var File = require('vinyl');
var fs = require('fs');
var path = require('path');
var thriftTsd = require('../');

describe('gulp-thrift-tsd', function() {

    it('test types.d.ts', function(done) {

        var tsdPath = path.join(__dirname, 'baseservice_types.d.ts');

        var data = fs.readFileSync(tsdPath);

        var file = new File({
            path: tsdPath,
            contents: data
        });

        var through = thriftTsd();

        through.write(file);

        through.end(function() {

            fs.writeFileSync(path.join(__dirname, 'result_types.d.ts'), file.contents);

            assert(file.isBuffer());

            done();
        });



    });

    
    it('test service.d.ts', function(done) {

        var tsdPath = path.join(__dirname, 'BaseService.d.ts');

        var data = fs.readFileSync(tsdPath);

        var file = new File({
            path: tsdPath,
            contents: data
        });

        var through = thriftTsd();

        through.write(file);

        through.end(function() {

            fs.writeFileSync(path.join(__dirname, 'result_service.d.ts'), file.contents);

            assert(file.isBuffer());

            done();
        });



    });


});