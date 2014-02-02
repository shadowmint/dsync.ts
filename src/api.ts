/// <reference path="__init__.ts"/>
module dsync {

    /*
     * The call to update the display from the model.
     * @param model The model object to get state from.
     * @param display The display object to update.
     * @param index The index of the first changed element in the state array.
     * @param dt The delta in ms since the last time this was called.
     * @return True to continue tracking this binding and false to discard it.
     */
    export interface Update<U, V> {
        (model:U, display:V, index:number, dt:number):boolean;
    }

    /*
     * The call to generate a summarized state value from the model to check for changes.
     * @param model The model object to generate the state from.
     * @param display The display object to generate the state from.
     * @param dt The delta in ms since the last time this was called.
     * @return An array of comparable state values.
     */
    export interface State<U, V> {
      (model:U, display:V, dt:number):any[];
    }
}
