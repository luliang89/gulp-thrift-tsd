'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');

const PLUGIN_NAME = 'gulp-thrift-tsd';
const TSD_EXT_NAME = '.d.ts';

var typeMap = {};

module.exports = function () {

    var typeFiles = [];
    var serviceFiles = [];

    function handleTypeFile(file) {
        var basename = path.basename(file.path);
        var name = basename.substring(0, basename.indexOf('_'));
        var src = file.contents.toString('utf8');
        src = src.replace(/declare /g, '');
        var reg = /[class|enum] (\w+) {/g;
        var result;
        var types = [];
        while ((result = reg.exec(src)) !== null) {
            types.push(result[1]);
        }
        typeMap[name.toLowerCase()] = types;
        src = 'export namespace ' + name + '_ttypes {\r\n' + src + '\r\n}';
        file.contents = new Buffer(src);
    }

    function handleServiceFile(file) {
        var src = file.contents.toString('utf8');
        src = src.replace(/declare/g, 'export');
        src = src.replace(/(\w+)Client {/g, '$1 {');
        src = src.replace(/\s+\w+:\s[\w\.]+;/g, '');
        src = src.replace(/\s+constructor\(.*\);/g, '');
        ///** 
        var basename = path.basename(file.path);
        var name = basename.substring(0, basename.indexOf('.')).toLowerCase();
        var types = typeMap[name];
        if (types) {
            types.forEach(function (t) {
                let r = ': ' + t + '([,;\)\[])';
                src = src.replace(new RegExp(r, 'g'), ':' + name + '_ttypes.' + t + '$1');
            });
        }
        //*/
        file.contents = new Buffer(src);
    }

    function findType(name, namespace) {
        if (namespace) {
            let key = namespace.replace('_ttypes', '').toLowerCase();
            let types = typeMap[key];
            if (types && types.indexOf(name) > -1) {
                return key;
            }
        }
        for (var key in typeMap) {
            if (typeMap[key].indexOf(name) > -1) {
                return key;
            }
        }
    }

    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            cb();
            return;
        }

        var typeExtName = '_types' + TSD_EXT_NAME;
        if (file.path.endsWith(typeExtName)) {
            typeFiles.push(file);
        } else {
            serviceFiles.push(file);
        }

        cb();
    }, function (cb) {
        var file;
        var files = [];
        if (typeFiles) {
            //console.info('typeFiles', typeFiles.length);
            files = files.concat(typeFiles);
            for (var i = 0; i < typeFiles.length; i++) {
                file = typeFiles[i];
                handleTypeFile(file);
            }
        }
        if (serviceFiles) {
            files = files.concat(serviceFiles);
            //console.info('serviceFiles', serviceFiles.length);
            for (var i = 0; i < serviceFiles.length; i++) {
                file = serviceFiles[i];
                handleServiceFile(file);
            }
        }

        var reg = /: ([A-Z]\w+)\b/g;
        var regNamespace = /export namespace (\w+) {/;
        var regClass = /export class (\w+) {/;
        var result;
        var src;
        var type;
        for (var i = 0; i < files.length; i++) {
            file = files[i];
            ///** 
            src = file.contents.toString('utf8');
            let namespace = null;
            result = regNamespace.exec(src);
            if (result !== null) {
                namespace = result[1];
            } else {
                result = regClass.exec(src);
                if (result !== null) {
                    namespace = result[1];
                }
            }
            //console.log(namespace);
            while ((result = reg.exec(src)) !== null) {
                let cssName = result[1];
                type = findType(cssName, namespace);
                if (!type) {
                    continue;
                }
                //console.log(cssName);
                let r = ': ' + cssName + '([,;\)\[])';
                src = src.replace(new RegExp(r, 'g'), ': ' + type + '_ttypes.' + cssName + '$1');
            }
            file.contents = new Buffer(src);
            //*/
            this.push(file);
        }


        cb();
    });

};