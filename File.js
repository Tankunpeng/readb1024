"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const rl = require("readline");
class File {
    readLines(path, callback, done) {
        var input = fs.createReadStream(path);
        var remaining = '';
        input.on('data', function (data) {
            remaining += data;
            var index = remaining.indexOf('\n');
            while (index > -1) {
                var line = remaining.substring(0, index);
                remaining = remaining.substring(index + 1);
                callback(line);
                index = remaining.indexOf('\n');
            }
        });
        input.on('end', function () {
            if (remaining.length > 0) {
                done();
            }
        });
    }
    readByline(input, callback, done) {
        const rlines = rl.createInterface({
            input: fs.createReadStream(input)
        });
        rlines.on('line', (line) => {
            callback(line);
        });
        rlines.on('close', () => {
            done();
        });
    }
    getFiles(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                fs.readdir(input, (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(files.map(i => path.join(input, i)));
                    }
                });
            });
            return promise;
        });
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map