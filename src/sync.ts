/// <reference path="__init__.ts"/>
module dsync {

    /* Top level manager for a set of synchronized objects */
    export class Sync {

        /* Actual channel objects */
        public channels:any = {};

        /* The rate at which we poll for changes */
        private _pollRate:number;

        /* If we have a pending update, the timer goes here */
        private _timer:any = null;

        /*
         * Create an instance of the sync class
         * @param pollRate The minimum interval in ms between updates.
         */
        public constructor(pollRate:number = 10) {
            this._pollRate = pollRate;
        }

        /* Get access to an events channel */
        public channel(name:string, ready:boolean = true, locked:boolean = false):Channel {
            if (this.channels[name] === undefined) {
                this.channels[name] = new dsync.Channel();
                this.channels[name].ready = ready;
                this.channels[name].locked = locked;
            }
            return this.channels[name];
        }

        /* Update channels async */
        public update():void {
            if (this._timer == null) {
                this._timer = setTimeout(() => {
                    this._timer = null;
                    for (var key in this.channels) {
                        var chan = this.channels[key];
                        if (chan.ready) {
                            if (!chan.locked) {
                                chan.ready = false;
                            }
                            chan.update();
                        }
                    }
                }, this._pollRate);
            }
        }

        /*
         * Touch a channel to make it update next frame
         * Notice this is an async request.
         */
        public touch(channel:any) {
            setTimeout(() => {
                if (typeof(channel) == 'string') {
                    channel = this.channel(channel);
                }
                channel.ready = true;
                this.update();
            }, 1);
        }

        /* Shortcut for channel.add() */
        public add<U, V>(channel:any, model:U, display:V, sync:Update<U,V>, state:State<U,V> = null):void {
            if (typeof(channel) == 'string') {
                channel = this.channel(channel);
            }
            channel.add(model, display, sync, state);
        }

        /*
         * Watch DOM changes on an element and trigger a channel
         * @param e The element to watch
         * @param event The event to trigger on
         * @param channel The channel to invoke when it happens
         */
        public watch(e:HTMLElement, events:string[], channel:any):void {
            if (typeof(channel) == 'string') {
                channel = this.channel(channel);
            }
            dsync.dom.watch(this, e, events, channel);
        }
    }
}
