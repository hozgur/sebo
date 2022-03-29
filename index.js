const mfile = require('./mfile').mfile;
const fs = require('fs');
const { exit } = require('process');

const filepath = "./TEMS/1a-14-03-163233/1a-14-03-163233.mrp";
const outpath = filepath.replace(/\.mrp$/, '.raw');

fs.open(filepath, 'r', function (err, f) {
    if (err) {
        console.log(err);
        throw err;
    }

    callback_func(new mfile(f));

});

function callback_func(mf) {
    // Read Header
    const width = mf.readInt32();
    const height = mf.readInt32();
    const resx = mf.readInt32();
    const resy = mf.readInt32();
    const colorcount = mf.readInt32();
    const bitcount = mf.readInt32();
    const passcount = mf.readInt32();
    const fixedDotSize = mf.readInt32();
    const fastMode = mf.readInt32();
    const buffer = mf.readBuffer(32 * 4);

    console.log("width: " + width);
    console.log("height: " + height);
    console.log("resx: " + resx);
    console.log("resy: " + resy);
    console.log("colorcount: " + colorcount);
    if (colorcount != 4) {
        console.log("Error: colorcount != 4");
        exit(1);
    }
    console.log("bitcount: " + bitcount);
    if (bitcount != 2) {
        console.log("Error: bitcount != 2");
        exit(1);
    }
    console.log("passcount: " + passcount);
    console.log("fixedDotSize: " + fixedDotSize);
    console.log("fastMode: " + fastMode);
    console.log("buffer: ", buffer);
    const linewidth = width * bitcount / 8;
    console.log("linewidth: " + linewidth);
    fs.open(outpath, "w", (err, f) => {
        if (err) {
            console.log(err);
            throw err;
        }
        let outbuffer = Buffer.alloc(width * 4);

        for (let y = 0; y < height; y++) {
            if (y % 100 == 0) {
                console.log("line: ", y);
            }
            for (let c = 0; c < colorcount; c++) {

                const line = mf.readBuffer(linewidth);
                let bit = 6;
                for (let x = 0; x < width; x++) {
                    let val = line[x >> 2];
                    outbuffer[(x << 2) + c] = 255 - (val & (3 << bit ) << (6-bit));
                    bit -= 2; if (bit < 0) { bit = 6 }
                }
            }
            fs.writeSync(f,outbuffer,0,width*4);
        }
    });
};


