/// <reference path="__init__.ts"/>
module dsync {
  export class Sync<U, V> {
    public sync(model:U, display:V, dt:number):boolean {
      return this._update();
    }

    private _update():boolean {
      return null;
    }
  }

  export interface Model {
  }

  export interface DisplayModel {
  }

  export class ModelSync extends Sync<Model, DisplayModel> {
  }
}
