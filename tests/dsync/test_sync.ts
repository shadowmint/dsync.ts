/// <reference path="__init__.ts"/>
class SyncTests extends turn.TestCase {

    constructor() {
        super('SyncTests');
    }

    test_can_create_channels():void {
        var sync = new dsync.Sync();
        var channel = <dsync.Channel> sync.channel('Hello');

        this.assert.true(channel != null);
    }

    test_can_register_task():void {
        var sync = new dsync.Sync();
        var channel = <dsync.Channel> sync.channel('Hello');

        channel.add<any, any>(
            (a:any, b:any, changed:boolean[], dt:number):boolean => { return true; },
            (a:any, dt:number):any[] => { return []; },
            {},
            {}
        );

        this.assert.true(channel != null);
    }

    test_can_trigger_change_event():void {
        var value:number = 0;
        var sync = new dsync.Sync();
        var channel = <dsync.Channel> sync.channel('Hello');
        channel.add<any, any>(
            (a:any, b:any, changed:boolean[], dt:number):boolean => {
                value = value + 1;
                return true;
            },
            (a:any, dt:number):any[] => {
                if (value < 3) {
                    return [value];
                }
                return [4];
            },
            {},
            {}
        );

        channel.update();
        channel.update();
        channel.update();
        channel.update();
        channel.update();

        this.assert.equals(value, 4);
    }

    test_can_ignore_change_event():void {
        var sync = new dsync.Sync();
        var channel = <dsync.Channel> sync.channel('Hello');
        var synced:number = 0;

        channel.add<any, any>(
            (a:any, b:any, changed:boolean[], dt:number):boolean => { synced += 1; return true; },
            (a:any, dt:number):any[] => { return [1]; },
            {},
            {}
        );
        channel.update();
        channel.update();

        this.assert.equals(synced, 1);
    }

    test_can_watch_actual_model():void {
        var sync = new dsync.Sync();
        var channel = <dsync.Channel> sync.channel('Hello');
        var model = new MyModel();
        var dsp = new MyDsp();

        model.value = 1;
        model.key = 'hello';

        channel.add<MyModel, MyDsp>(MyModelMap.sync, MyModelMap.state, model, dsp);
        channel.update();
        var output1 = dsp.output;

        channel.update();
        var output2 = dsp.output;

        model.key = '99';
        channel.update();
        var output3 = dsp.output;

        model.value = 15;
        channel.update();
        var output4 = dsp.output;

        this.assert.equals(output1, 'hello::1');
        this.assert.equals(output2, 'hello::1');
        this.assert.equals(output3, '99::1');
        this.assert.equals(output4, '99::15');
        this.assert.false(model.alive);
    }

}
runner.register(new SyncTests());

// Dummy types for testing
class MyModel {
    value:number = 0;
    key:string = '';
    alive:boolean = true;
}

class MyDsp {
    output:string;
}

class MyModelMap {
    public static sync(model:MyModel, display:MyDsp):boolean {
        if (model.value > 10) {
            model.alive = false;
        }
        display.output = model.key + '::' + model.value;
        return model.alive;
    }

    public static state(model:MyModel):any[] {
        return [model.value, model.key];
    }
}
