/// <reference path="__init__.ts"/>
module dsync {

    /* A set of watch bindings */
    export class Channel {

        /* The set of child bindings held */
        public children:any[] = [];

        /* Timestamp */
        public timestamp:number = 0;

        /* If this channel currently needs an update */
        public ready:boolean = true;

        /* Add a sync model-display binding to this channel */
        public add<U, V>(sync:Update<U,V>, state:State<U,V>, model:U, display:V):void {
            this.children.push(<Binding<U,V>> {
                sync: sync,
                state: state,
                model: model,
                display: display,
                last: null,
                alive: true
            });
        }

        /* Update all child elements if they have altered state */
        public update():void {
            if (!this.ready) {
                return;
            }
            var now = Date.now();
            var dt = this.timestamp == 0 ? 1 : now - this.timestamp;
            this.timestamp = now;
            var dropped:boolean = false;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];
                if (this.updated(child, dt)) {
                    child.alive = child.sync(child.model, child.display, dt);
                    if (child.alive) {
                        dropped = true;
                    }
                }
            }
            if (dropped) {
                var children = [];
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i].alive) {
                        children.push(this.children[i]);
                    }
                }
                this.children = children;
            }
        }

        /* Check if a child has updated */
        public updated<U, V>(target:Binding<U, V>, dt:number):boolean {
            if (target.last == null) {
                target.last = target.state(target.model, dt);
                return true;
            }
            var state = target.state(target.model, dt);
            var changed = false;
            for (var i = 0; i < state.length; ++i) {
                if (state[i] !== target.last[i]) {
                    changed = true;
                    target.last = state;
                    break;
                }
            }
            return changed;
        }
    }
}
