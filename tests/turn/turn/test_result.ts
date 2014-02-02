/// <reference path="__init__.ts"/>
module turn {

    /* Test results */
    export interface TestResult {
        label:string;
        tests:number;
        failed:number;
        failures:string[];
    }
}
