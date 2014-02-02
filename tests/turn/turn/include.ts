/// <reference path="__init__.ts"/>
declare var require;
declare var global;
module turn {
    var fs:any = require("fs");

    function read(f) {
        return fs.readFileSync(f).toString()
    };

    /* Load a node module directly by path */
    export function include(f) {
        eval.apply(global, [read(f)])
    };
}
