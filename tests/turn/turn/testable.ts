/// <reference path="__init__.ts"/>
module turn {

    /* Anything we can test */
    export interface Testable {
        label:string;
        execute(log:TestLogger):TestResult;
    }
}
