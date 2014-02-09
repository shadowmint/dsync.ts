/// <reference path="../__init__.ts"/>
class ConsoleLogger implements turn.TestLogger {
    info(msg):void {
        console.log(msg);
    }

    warn(msg):void {
        console.warn(msg);
    }

    error(msg, e):void {
        console.error(msg, e);
    }
}
