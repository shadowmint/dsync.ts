/// <reference path="__init__.ts"/>
module dsync {

    /* A bound watcher for a particular model-display mapping */
    export interface Binding<U, V> {
        state:State<U, V>;
        sync:Update<U, V>;
        model:U;
        display:V;
        last:any[];
        alive:boolean;
    }
}