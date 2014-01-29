/// <reference path="dsync.d.ts"/>
interface EgModel {
  src:HTMLElement;
  content:string;
  stop:boolean;
}

interface EgDisplayModel {
  timer:HTMLElement;
  content:HTMLElement;
}

// Track changes to the model and update display
class ModelSync extends Sync<Model, DisplayModel> {

  // Sync the model state to the display state
  public sync(model:EgModel, display:EgDisplayModel, dt:number):boolean {
    display.content.innerHTML = model.content;
    return !model.stop;
  }

  // Used to check if sync should be invoked
  // Return only the fields to compare.
  public state(model:EgModel):any[] {
    return [
      model.content,
      model.stop
    ];
  }
}

// Track changes to the src node and update model
class ModelRSync extends Sync<Model, DisplayModel> {

  // Sync the model state to the display state
  public sync(model:EgModel, display:EgDisplayModel, dt:number):boolean {
    model.content = model.src.innerHTML;
    return !model.stop;
  }

  // Used to check if sync should be invoked
  // Return only the fields to compare.
  public state(model:EgModel):any[] {
    return [ model.src.innerHTML ];
  }
}

function main() {
  var sync = dsync.Container();
  var model = <EgModel> { 
    src: document.getElementById('src1'), 
    content: '', 
    stop: false 
  };
  var display = <EgDisplayModel> { 
    content: document.getElementById('content1'),
    timer: document.getElementById('timer')
  };
  
  // Watch for changes
  sync.add(ModelSync, model, display);
  sync.add(ModelRSync, model, display);
  window['sync1'] = sync;
}
