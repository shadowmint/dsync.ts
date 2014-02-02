/// <reference path="__init__.ts"/>
class AddTests extends turn.TestCase {

    constructor() {
        super('AddTests');
    }

    test_works(a:turn.Assert, l:turn.TestLogger):void {
        l.info('Thing');
        a.true(blah.worksAdd(3, 5) == 8);
    }

    test_fails(a:turn.Assert):void {
        a.false(blah.failsAdd(3, 5) == 8);
    }
}
runner.register(new AddTests());
