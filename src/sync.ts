/// <reference path="__init__.ts"/>
module dsync {

    /* Base interface for any synchronization actions. */
    export interface ISync<U, V> {

        /*
         * Generate a new model/display from the current model/display state.
         * This function is only invoked if the state() call has changed.
         * To stop tracking this sync in the container, return false.
         *
         * This is considered an expensive operation and every attempt is
         * made to minimize the number of times it is called.
         *
         * @param model An instance of the model type.
         * @param display An instance of the display model type.
         * @param dt The time since the last time this was called.
         */
        sync(model:U, display:V, dt:number):boolean;

        /*
         * Generate a new state array for this object.
         *
         * The state comparison algorithm is simple and predictable:
         *
         *    for element i in state:
         *      if state[i] !== previous_state[i]
         *        return true
         *
         * This is considered a cheap operation and will be invoked
         * often, best performance can be given by minimizing the size
         * and cost of generate the return array.
         *
         * @param model An instance of the model type.
         * @param display An instance of the display model type.
         * @param dt The time since the last time this was called.
         */
        state(model:U, display:V, dt:number):any[];
    }

    /* Sync is a helper class that implements ISync */
    export class Sync<U, V> implements ISync<U, V> {

        /* The length of time since the last time sync was called */
        public idle:number = 0;

        /*
         * Generate a new model/display from the current model/display state.
         * see ISync::sync
         *
         * The default action is to do nothing.
         *
         * @param model An instance of the model type.
         * @param display An instance of the display model type.
         * @param dt The time since the last time this was called.
         */
        sync(model:U, display:V, dt:number):boolean {
            return true;
        }

        /*
         * Generate a new state array for this object.
         * see ISync::state
         *
         * Notice the 'idle' member of the this class. Framerate can
         * be controlled easily using this, eg. return [ dt > 100 ];
         *
         * The default action is return the time delta; that is,
         * update every update.
         *
         * @param model An instance of the model type.
         * @param display An instance of the display model type.
         * @param dt The time since the last time this was called.
         */
        state(model:U, display:V, dt:number):any[] {
            return [dt];
        }
    }
}
