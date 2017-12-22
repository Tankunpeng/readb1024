import * as fs from 'fs';
import * as path from 'path';
import * as rl from 'readline';

export class File {

    public readLines(path: string, callback: (line: string) => void, done: () => void) {
        var input = fs.createReadStream(path);
        var remaining = '';
        input.on('data', function (data: string) {
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

    public readByline(input: string, callback: (line: string) => void, done: () => void) {
        const rlines = rl.createInterface({
            input: fs.createReadStream(input)
        });

        rlines.on('line', (line: string) => {
            callback(line);
        })

        rlines.on('close', () => {
            done();
        });
    }

    public async getFiles(input: string) {
        let promise = new Promise<string[]>((resolve, reject) => {
            fs.readdir(input, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files.map(i => path.join(input, i)));
                }
            });
        });

        return promise;
    }
}
