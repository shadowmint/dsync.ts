/// <reference path="__init__.ts"/>
class FormatTests extends turn.TestCase {

    constructor() {
        super('FormatTests');
    }

    test_can_format_string_with_replace():void {
        var input = "{} Test text {} dafdsaf {}"
        var output = turn.format(input, 'ONE', 'TWO', 'THREE')
        this.assert.equals(output, 'ONE Test text TWO dafdsaf THREE');
    }

    test_can_format_string_without_replace():void {
        var input = "Test text dafdsaf"
        var output = turn.format(input, 'ONE', 'TWO', 'THREE')
        this.assert.equals(output, 'Test text dafdsaf');
        this.assert.true(false);
    }
}
runner.register(new FormatTests());
