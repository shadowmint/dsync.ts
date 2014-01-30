/// <reference path="__init__.ts"/>
module dsync {
  export class Container {

      private _touched:boolean = false;

      private _timestamp:number = 0;

      public bind<U, V>(sync:ISync<U, V>, model:U, display:V):void {
      }

      public touch():void {
        this._touched = true;
      }

      public update():void {
      }

      public poll():void {
      }
  }
}
