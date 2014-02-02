/// <reference path="__init__.ts"/>
module turn {

    /*
     * Special format an incoming string.
     * eg. format('{}....{}....{}', turn.RED, turn.GREEN, turn.RESET)
     */
    export function format(msg:string, ...args:string[]):string {
        var offset:number;
        var copy = msg;
        var aoffset = 0;
        var rtn = '';
        var marker = '{}';
        while ((offset = copy.indexOf(marker)) != -1) {
            rtn += copy.substr(0, offset);
            if (args.length > aoffset) {
                rtn += args[aoffset];
                aoffset += 1;
            }
            copy = copy.substr(offset + marker.length, copy.length - offset);
        }
        rtn += copy;
        return rtn;
    }

    /* Colors */
    export var BLACK:string = '\033[90m'
    export var RED:string = '\033[91m'
    export var GREEN:string = '\033[92m'
    export var YELLOW:string = '\033[93m'
    export var BLUE:string = '\033[94m'
    export var MAGENTA:string = '\033[95m'
    export var CYAN:string = '\033[96m'
    export var WHITE:string = '\033[97m'
    export var RESET:string = '\033[0m'
}
