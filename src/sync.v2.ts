/// <reference path="__init__.ts"/>
module dsync {

    export interface Sync<U, V> {
        (model:U, display:V, dt:number):boolean;
    }

    export interface State<U, V> {
      (model:U, display:V, dt:number):any[];
    }

    export interface Binding<U, V> {
      state:State<U, V>;
      sync:Sync<U, V>;
      model:U;
      display:V;
      last:any[];
    }

    export class Container {
      public children:any[];
      public touched:boolean = false; // Ran last frame?
      public dt:number = 0;

      // Add target to watch
      public add<U, V>(sync:Sync<U,V>, state:State<U,V>, model:U, display:V):void {
        this.children.push({
          sync: sync,
          state: state,
          model: model,
          display: display,
          last: null
        });
      }

      // Request update
      public touch():void {
        this.touched = true;
      }

      // Update targets 
      public update():void {
        if (this.touched) {
          this.touched = false;
          for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (child.last == null) || this.updated(child)) {
              child.sync(child.model, child.display, this.dt);
            }
          }
        }
      }

      // Check if a child has updated
      public updated(target:Binding):boolean {
        var state = target.state(target.model, target.display, this.dt);
        var changed = false;
        for (var i = 0; i < state.length; ++i) {
          if (state[i] !== target.last[i]) {
            changed = true;
            break;
          }
        }
        return changed;
      }
    }

    // TODO: Update manager: run every frame?
    // TODO: Update manager: on dom events?
}
