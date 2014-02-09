/// <reference path="../bin/dsync.d.ts"/>
declare var PIXI:any;
declare var p2:any;
module physics {

    /* Model state for a block object */
    export class Block {
        public parent:Demo;
        public alive:boolean; /* Is this block still alive? */
        public geom:number[]; /* x, y, width, height, rotation */
        public age:number;    /* How long have we been alive? */
        public body:any;      /* Physics body */
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


        constructor(sync:dsync.Sync) {
            this.stage = new PIXI.Stage(0xffffff);
            this.renderer = PIXI.autoDetectRenderer(500, 500);
            document.body.appendChild(<HTMLElement> this.renderer.view);
            this.sync = sync;
        }

        /* Redraw */
        public redraw():void {
            this.renderer.render(this.stage);
        }
    }

    /* P2 world */
    export class P2 {

        /* The physics world */
        world:any;

        /* Parent for notifications */
        parent:Demo;

        /* The floor */
        floor:any;

        /* Create a world */
        constructor(parent:Demo) {
            this.world = new p2.World();
            this.world.broadphase = new p2.NaiveBroadphase(this.world);

            // Add a floor
            var planeShape = new p2.Plane();
            var planeBody = new p2.Body({ position:[0,1] });
            planeBody.addShape(planeShape);
            this.world.addBody(planeBody);
            this.parent = parent;
            this.floor = planeBody;
        }

        /* Create a body for the given block */
        public body(block:Block):any {
            var shape = new p2.Rectangle(block.geom[2] * 2, block.geom[3] * 2);
            var body = new p2.Body({
                mass:1,
                position:[block.geom[0],block.geom[1]],
                angularVelocity:0
            });
            body.addShape(shape);
            this.world.addBody(body);
            return body;
        }

        /* Destroy a body */
        public destroyBody(body:any):void {
            this.world.removeBody(body);
        }

        /* Read geometry from a body */
        public readGeometry(body:any, block:Block):void {
            if (block) {
                block.geom[0] = body.position[0];
                block.geom[1] = body.position[1];
                block.geom[4] = body.angle;
            }
        }

        /* Timestep */
        public step(dt:number):void {
            this.world.step(1/60);
            for (var i = 0; i < this.world.bodies.length; ++i) {
                var body = this.world.bodies[i];
                this.readGeometry(body, body.data);
            }

            var collisions = this.world.broadphase.getCollisionPairs();
            for (var i = 0; i < collisions.length; i += 2) {
                var block:Block = null;
                if (collisions[i] == this.floor) {
                    block = <Block> collisions[i + 1].data;
                }
                else if (collisions[i + 1] == this.floor) {
                    block = <Block> collisions[i].data;
                }
                console.log(collisions[i]);
                console.log(collisions[i+1]);
                if (block) {
                    block.age += dt / 1000;
                    console.log('Touching floor for: ' + block.age);
                    window['demo'].stop();
                }
            }

            this.parent.sync.touch('physics');
        }
    }

    /* Various actions on block elements */
    export class Demo {

        /* Worker for animation frames */
        private _worker:any;

        /* Running? */
        private _running:boolean = true;

        /* The sync we'll use for this */
        public sync:dsync.Sync;

        /* Pixi stage */
        public pixi:Pixi;

        /* Physics model */
        public physics:P2;

        /* Set of blocks */
        //public blocks:Block[] = [];

        constructor() {
            this.sync = new dsync.Sync();
            this.sync.channel('physics');
            this.pixi = new Pixi(this.sync);
            this.physics = new P2(this);
            this._worker = (dt) => { this.step(dt); };
        }

        /* Update the sprite to match the model */
        public blockSync(b:Block, s:Sprite, changed:boolean[], dt:number):boolean {
            s.gc.position.x = b.geom[0] * 50;
            s.gc.position.y = 500 - b.geom[1] * 50;
            s.gc.scale.x = b.geom[2];
            s.gc.scale.y = b.geom[3];
            s.gc.rotation = -b.geom[4];
            if (b.age > 5000) {
                b.alive = false;
            }
            if (!b.alive) {
                b.body.data = null;
                this.physics.destroyBody(b.body);
            }
            return b.alive;
        }

        /* Generate a state record for the block */
        public blockState(b:Block, s:Sprite, dt:number):any[] {
            var rtn = b.geom.slice(0);
            return rtn;
        }

        /* Factory for block objects */
        private _createSprite():Sprite {
            var rtn = new Sprite();
            var color = 0x333333 + (Math.floor(Math.random() * 128) << 16) + (Math.floor(Math.random() * 128) << 8) + (Math.floor(Math.random() * 128) << 8);
            rtn.gc = new PIXI.Graphics();
            rtn.gc.beginFill(color);
            rtn.gc.drawRect(-50, -50, 100, 100);
            this.pixi.stage.addChild(rtn.gc);
            return rtn;
        }

        /* Factory for display objects */
        private _createBlock(x:number, y:number):Block {
            var rtn = new Block();
            rtn.alive = true;
            rtn.geom = [x, y, 0.5, 0.5, 0];
            rtn.parent = this;
            rtn.age = 0;
            //this.blocks.push(rtn);
            rtn.body = this.physics.body(rtn);
            rtn.body.data = rtn;
            return rtn;
        }

        /* Create a block that is synced to a display object */
        public create(x:number, y:number):void {
            var block = this._createBlock(x, y);
            var sprite = this._createSprite();
            var physics =  this.sync.channel('physics');
            physics.add<Block, Sprite>(this.blockSync, this.blockState, block, sprite);
        }

        step(dt:number):void {
            if (this._running) {
                requestAnimationFrame(this._worker);
                this.physics.step(dt);
                this.sync.update();
                this.pixi.redraw();
            }
        }

        start():void {
            requestAnimationFrame(this._worker);
        }

        stop():void {
            this._running = false;
        }
    }
}
