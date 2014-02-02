/// <reference path="__init__.ts"/>
module turn {

    /* Assertion helper */
    export class Assert {

        true(a:boolean):void {
            if (!a) {
                throw new Error(a + ' !== true');
            }
        }

        false(a:boolean):void {
            if (a) {
                throw new Error(a + ' !== false');
            }
        }

        equals(a:any, b:any):void {
            if (a !== b) {
                throw new Error(a + ' !== ' + b);
            }
        }

        /* For floats, support fuzzy matching */
        near(a:number, b:number, fuz=0.01):void {
            if (Math.abs(a - b) > fuz) {
                throw new Error(a + ' not within ' + fuz + ' of ' + b);
            }
        }
    }
}
