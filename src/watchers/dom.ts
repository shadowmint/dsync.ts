/// <reference path="__init__.ts"/>
module dsync {
    export module dom {

        /* Watch DOM changes on an element and trigger a channel */
        export function watch(sync:Sync, e:HTMLElement, events:string[], channel:Channel):void {
            for (var i = 0; i < events.length; ++i) {
                addEventListener(e, events[i], () => {
                    channel.ready = true;
                    sync.update();
                });
            }
        }

        function addEventListener(e:HTMLElement, key:string, callback:any):void {
            if (e.addEventListener) {
                e.addEventListener(key, callback, false);
            }
            else if (e.attachEvent) {
                e.attachEvent('on' + key, callback);
            }
        }

        function removeEventListener(e:HTMLElement, key:string, callback:any):void {
            if (e.removeEventListener) {
                e.removeEventListener(key, callback, false);
            }
            else if (e.detachEvent) {
                e.detachEvent('on' + key, callback);
            }
        }
    }
}
