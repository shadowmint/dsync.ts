/// <reference path="__init__.ts"/>
module turn {

    /* A test runner */
    export class TestCase implements turn.Testable {

        /* Label for this test */
        public label:string = '';

        /* Asserter */
        public assert:Assert = null;

        constructor(label:string) {
            this.label = label;
            this.assert = new turn.Assert();
        }

        public execute(log:turn.TestLogger):turn.TestResult {
            var total = 0;
            var failed = 0;
            var failures = [];
            for (var key in this) {
                if (key.substr(0, 4) == 'test') {
                    var tname = this.label + '.' + key;
                    try {
                        ++total;
                        eval('this.'+key+'(this.assert, log);');
                        log.info(': passed: ' + tname);
                    }
                    catch (e) {
                        ++failed;
                        log.error(': failed: ' + tname, e);
                        failures.push(tname);
                    }
                }
            }
            return <turn.TestResult> {
                tests: total,
                failed: failed,
                failures: failures,
                label: this.label
            }
        }
    }
}
