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

        /* Locked into a ready state? */
        public locked:boolean = false;

        /* Add a sync model-display binding to this channel */
        public add<U, V>(model:U, display:V, sync:Update<U,V>, state:State<U,V> = null):void {
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
            var now = Date.now();
            var dt = this.timestamp == 0 ? 1 : now - this.timestamp;
            this.timestamp = now;
            var dropped:boolean = false;
            var changed = [];
            var change = false;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];
                change = this.updated(child, changed, dt);
                if (change) {
                    child.alive = child.sync(child.model, child.display, changed, dt);
                    if (!child.alive) {
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

        /*
         * Check if a child has updated.
         * @param target A sync binding.
         * @param changed An array to put changed booleans into.
         * @param dt The time delta since last update.
         * @return the index into the state array of the first changed value.
         */
        public updated<U, V>(target:Binding<U, V>, changed:boolean[], dt:number):boolean {
            changed.splice(0);
            if (target.last == null) {
                target.last = this._state(target, dt);
                if (target.last != null) {
                    for (var i = 0; i < target.last.length; ++i) {
                        changed.push(true);
                    }
                }
                return true;
            }
            var change = false;
            var state = this._state(target, dt);
            if (state != null) {
                for (var i = 0; i < state.length; ++i) {
                    changed.push(state[i] !== target.last[i]);
                    if (changed[i]) {
                      change = true;
                    }
                }
            }
            target.last = state;
            return change;
        }

        /* Get the state record for a target */
        private _state(binding:any, dt:number):any[] {
            if (binding.state == null) {
                return null;
            }
            return binding.state(binding.model, binding.display, dt);
        }
    }
}
