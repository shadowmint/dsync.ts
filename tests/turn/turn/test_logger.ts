/// <reference path="__init__.ts"/>
module turn {

    /* Logger base */
    export interface TestLogger {

        /* Info messages */
        info(msg:any): void;

        /* Warnings */
        warn(msg:any): void;

        /* Errors */
        error(msg:any, e:any): void;
    }
}
