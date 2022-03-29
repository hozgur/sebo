const path = require('path');
const fs = require('fs');


class mfile {
    constructor(f) {
        this.file = f;        
    }
    
    readBuffer(size) {
        let buf = Buffer.alloc(size);
        let readbytes = fs.readSync(this.file,buf,0,size)
            if(readbytes != size) {
                console.log("Error reading buffer");
                return null;       
            };
        return buf;
        };

    readInt8() {
        return this.readBuffer(1).readInt8();
    }
    readInt16() {
        return this.readBuffer(2).readInt16LE();
    }
    readInt32() {
        return this.readBuffer(4).readInt32LE();
    }
    readInt64() {
        return this.readBuffer(8).readInt64LE();
    }
}

module.exports = { 
    mfile,
    default : mfile
 };