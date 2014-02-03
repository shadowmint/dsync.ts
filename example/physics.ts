/// <reference path="../bin/dsync.d.ts"/>
declare var PIXI:any;
module physics {

    /* Model state for a block object */
    export class Block {
        public parent:Demo;
        public alive:boolean; /* Is this block still alive? */
        public geom:number[]; /* x, y, width, height, rotation */
        public age:number;  /* How long have we been alive? */
    }

    /* Display for a block object */
    export class Sprite {
        public gc:any;
    }

    /* Pixi renderer we're using */
    export class Pixi {

        /* Renderer we're using */
        renderer:any;

        /* Stage we're using */
        stage:any;

        /* Sync target */
        sync:dsync.Sync;

        /* Worker for animation frames */
        private _worker:any;

        constructor(sync:dsync.Sync) {
            this.renderer = PIXI.autoDetectRenderer(500, 500);
            this.stage = new PIXI.Stage;
            document.body.appendChild(<HTMLElement> this.renderer.view);
            this._worker = () => { this.animate(); };
            this.sync = sync;
        }

        animate():void {
            requestAnimationFrame(this._worker);
            this.sync.update();
            this.renderer.render(this.stage);
        }

        start():void {
            requestAnimationFrame(this._worker);
        }
    }

    /* Various actions on block elements */
    export class Demo {

        /* The sync we'll use for this */
        public sync:dsync.Sync;

        /* Pixi stage */
        public pixi:Pixi;

        /* Set of blocks */
        public blocks:Block[] = [];

        constructor() {
            this.sync = new dsync.Sync();
            this.sync.channel('physics');
            this.pixi = new Pixi(this.sync);
        }

        /* Update the sprite to match the model */
        public blockSync(b:Block, s:Sprite, index:number, dt:number):boolean {
            s.gc.position.x = b.geom[0];
            s.gc.position.y = b.geom[1];
            s.gc.width = b.geom[2];
            s.gc.height = b.geom[3];
            s.gc.rotation = b.geom[4];
            b.age += dt;
            console.log('Updated to: ' + JSON.stringify(b.geom));
            return b.alive;
        }

        /* Generate a state record for the block */
        public blockState(b:Block, s:Sprite, dt:number):any[] {
            var rtn = b.geom.slice(0);
            console.log('state: ' + JSON.stringify(rtn));
            return rtn;
        }

        /* Factory for block objects */
        private _createSprite():Sprite {
            var rtn = new Sprite();
            var color =  (Math.floor(Math.random() * 255) << 16) + (Math.floor(Math.random() * 255) << 8) + (Math.floor(Math.random() * 255) << 8);
            rtn.gc = new PIXI.Graphics();
            rtn.gc.beginFill(color);
            rtn.gc.drawRect(0, 0, 100, 100);
            rtn.gc.alpha = 0.5;
            this.pixi.stage.addChild(rtn.gc);
            return rtn;
        }

        /* Factory for display objects */
        private _createBlock(x:number, y:number):Block {
            var rtn = new Block();
            rtn.alive = true;
            rtn.geom = [x, y, 10, 10, 0];
            rtn.parent = this;
            rtn.age = 0;
            this.blocks.push(rtn);
            return rtn;
        }

        /* Create a block that is synced to a display object */
        public create(x:number, y:number):void {
            var chan =  this.sync.channel(this.sync.channels.physics);
            chan.add<Block, Sprite>(this.blockSync, this.blockState, this._createBlock(x, y), this._createSprite());
        }
    }
}