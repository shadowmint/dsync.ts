/// <reference path="__init__.ts"/>
module dsync {

    export interface Update<U, V> {
        (model:U, display:V, dt:number):boolean;
    }

    export interface State<U, V> {
      (model:U, dt:number):any[];
    }



    // TODO: Update manager: run every frame?
    // TODO: Update manager: on dom events?
}
