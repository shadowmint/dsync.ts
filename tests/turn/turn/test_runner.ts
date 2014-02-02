/// <reference path="__init__.ts"/>
module turn {

    /* An aggregate reporter for test cases */
    export class TestRunner {

        /* Tests */
        tests:turn.Testable[] = [];

        /* Results */
        results:turn.TestResult[] = [];

        /* Aggregate results */
        total:number = 0;
        failed:number = 0;
        failures:string[] = [];

        /* Logger */
        log:turn.TestLogger = null;

        constructor(log:turn.TestLogger) {
            this.log = log;
        }

        /* Run all tests */
        execute():void {
            for (var i = 0; i < this.tests.length; ++i) {
                var test = this.tests[i];
                var result:turn.TestResult = null;
                try {
                    result = test.execute(this.log);
                }
                catch (e) {
                    this.log.error('Failed to run test case', e);
                    result = <turn.TestResult> {
                        tests: 1,
                        failed: 1,
                        label: e.toString(),
                        failures: [],
                    };
                }
                this.total += result.tests;
                this.failed += result.failed;
                for (var j = 0; j < result.failures.length; ++j) {
                    this.failures.push(result.failures[j]);
                }
                this.results.push(result);
            }
        }

        /* Register a testable */
        register(t:turn.Testable) {
            this.tests.push(t);
        }

        /* Print a summary */
        report():void {
            this.log.info(':: ' + (this.total - this.failed) + '/' + this.total + ' passed');
            if (this.failed > 0) {
                for (var i = 0; i < this.failures.length; ++i) {
                    this.log.info(turn.format(':: {}failed{}: ' + this.failures[i], turn.RED, turn.RESET));
                }
            }
            else {
                this.log.info(turn.format(':: {}PASSED{}', turn.GREEN, turn.RESET));
            }
        }
    }
}
