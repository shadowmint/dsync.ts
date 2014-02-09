/// <reference path="../bin/dsync.d.ts"/>
declare var PIXI:any;
declare var Box2D:any;
module physics {

    /* Model state for a block object */
    export class Block {
        public parent:Demo;
        public meta:number = 1; /* Magical type id */
        public alive:boolean;   /* Is this block still alive? */
        public geom:number[];   /* x, y, width, height, rotation */
        public age:number;      /* How long have we been alive? */
        public body:any;        /* Physics body */
        public ground:boolean;  /* Touching the ground? */
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

        /* Remove a sprite */
        public destroySprite(s:Sprite):void {
            this.stage.removeChild(s.gc);
        }
    }

    /* Phys world */
    export class Phys {

        /* The physics world */
        world:any;

        /* Parent for notifications */
        parent:Demo;

        /* Ground marker */
        ground:any;

        /* Create a world */
        constructor(parent:Demo) {
            this.parent = parent;
            var gravity = new Box2D.b2Vec2(0.0, -9.8);
            var world = new Box2D.b2World(gravity, true);

            // Ground
            var shape = new Box2D.b2EdgeShape();
            shape.Set(new Box2D.b2Vec2(-30, 0), new Box2D.b2Vec2(30.0, 0));

            var bd_ground = new Box2D.b2BodyDef();
            bd_ground.set_type(Box2D.b2_staticBody);
            var ground = world.CreateBody(bd_ground);
            ground.data = {'meta': 0};
            ground.CreateFixture(shape, 0.0);
            this.ground = ground;

            // Contacts watcher
            var listener = new Box2D.b2ContactListener();
            Box2D.customizeVTable(listener, [{
                original: Box2D.b2ContactListener.prototype.BeginContact,
                replacement: function (thsPtr, contactPtr) {
                    var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
                    var fixtureA = contact.GetFixtureA();
                    var fixtureB = contact.GetFixtureB();
                    if ((fixtureA.GetBody().data.meta == 0) || (fixtureB.GetBody().data.meta == 0)) {
                        var block = fixtureA.GetBody().data.meta == 1 ? fixtureA.GetBody().data : fixtureB.GetBody().data;
                        block.ground = true;
                    }
                }
            }]);
            world.SetContactListener(listener);

            this.world = world;
        }

        /* Create a body for the given block */
        public body(block:Block):any {
            var shape = new Box2D.b2PolygonShape();
            shape.SetAsBox(block.geom[2], block.geom[3]);
            shape.density = 1;

            var ZERO = new Box2D.b2Vec2(block.geom[0], block.geom[1]);

            var bd = new Box2D.b2BodyDef();
            bd.set_type(Box2D.b2_dynamicBody);
            bd.set_position(ZERO);

            var body = this.world.CreateBody(bd);
            body.CreateFixture(shape, 1);
            return body;
        }

        /* Destroy a body */
        public destroyBody(body:any):void {
            this.world.DestroyBody(body);
        }

        /* Read geometry from a body */
        public readGeometry(body:any, block:Block):void {
            if ((block) && (block.meta == 1)) {
                var body = block.body;
                var bpos = body.GetPosition();
                block.geom[0] = bpos.get_x();
                block.geom[1] = bpos.get_y();
                block.geom[4] = body.GetAngle();
            }
        }

        /* Timestep */
        public step(dt:number):void {
            this.world.Step(1/60, 6, 2);
            var body = this.world.GetBodyList();
            while(body.a != 0) {
                this.readGeometry(body, body.data);
                body = body.GetNext();
            }
            this.parent.sync.touch('physics');
        }
    }

    /* Various actions on block elements */
    export class Demo {

        /* Count of active items */
        public count:number = 0;

        /* Worker for animation frames */
        private _worker:any;

        /* Running? */
        private _running:boolean = true;

        /* The sync we'll use for this */
        public sync:dsync.Sync;

        /* Pixi stage */
        public pixi:Pixi;

        /* Physics model */
        public physics:Phys;

        /* Set of blocks */
        //public blocks:Block[] = [];

        constructor() {
            this.sync = new dsync.Sync();
            this.sync.channel('physics');
            this.pixi = new Pixi(this.sync);
            this.physics = new Phys(this);
            this._worker = (dt) => { this.step(dt); };
        }

        /* Update the sprite to match the model */
        public blockSync(b:Block, s:Sprite, changed:boolean[], dt:number):boolean {
            s.gc.position.x = b.geom[0] * 50;
            s.gc.position.y = 500 - b.geom[1] * 50;
            s.gc.scale.x = b.geom[2];
            s.gc.scale.y = b.geom[3];
            s.gc.rotation = -b.geom[4];
            s.gc.alpha = 1;
            if (b.ground) {
                b.age += dt;
            }
            if (b.age > 2000) {
                b.alive = false;
            }
            if (!b.alive) {
                b.parent.destroyBlock(b, s);
            }
            return b.alive;
        }

        /* Generate a state record for the block */
        public blockState(b:Block, s:Sprite, dt:number):any[] {
            var rtn = b.geom.slice(0);
            rtn.push(b.age);
            return rtn;
        }

        /* Destroy a block */
        public destroyBlock(b:Block, s:Sprite):void {
            b.body.data = null;
            b.parent.physics.destroyBody(b.body);
            b.parent.pixi.destroySprite(s);
            this.count -= 1;
        }

        /* Factory for block objects */
        private _createSprite():Sprite {
            var rtn = new Sprite();
            var color = 0x808080 + (Math.floor(Math.random() * 128) << 16) + (Math.floor(Math.random() * 128) << 8) + (Math.floor(Math.random() * 128));
            rtn.gc = new PIXI.Graphics();
            rtn.gc.beginFill(color);
            rtn.gc.drawRect(-50, -50, 100, 100);
            rtn.gc.alpha = 0;
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
            rtn.body = this.physics.body(rtn);
            rtn.ground = false;
            rtn.body.data = rtn;
            this.count += 1;
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
