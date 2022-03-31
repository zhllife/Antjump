var PlayerControl = pc.createScript('PlayerControl');

PlayerControl.attributes.add('playermaterial', {
    type: 'asset',
    array: false
});
PlayerControl.attributes.add('lefttex', {
    type: 'asset',
    array: false
});
PlayerControl.attributes.add('righttex', {
    type: 'asset',
    array: false
});
PlayerControl.prototype.initialize = function() {
    var app = this.app;

    app.graphicsDevice.maxPixelRatio = window.devicePixelRatio === 1 ? 1 : 2;
    var canvas = app.graphicsDevice.canvas;
    app.resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = '';
    canvas.style.height = '';

    var manager = app.root.findByName("Manager");
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.uimanager = manager.script.UIManaegr;
    this.halfscreenwidth = window.innerWidth / 2.0;
    this.JumpTime = 0.2;
    this.Hstep = 0.5;
    this.Vstep = 0.25;
    this.body = this.entity.findByName("body");
    this.shadow = app.root.findByName("shadow");

    this.playermat = app.assets.get(this.playermaterial.id).resource;
    this.Ltex = app.assets.get(this.lefttex.id).resource;
    this.Rtex = app.assets.get(this.righttex.id).resource;

    this.tips = app.root.findByName("tips");
    this.tips.enabled = false;

    var aspect = window.innerWidth/window.innerHeight;
    var bgaspect = 1082/1917;
    this.bg = app.root.findByName('bg');
    var height,width;
    if(aspect > bgaspect){
        width = 6*aspect;
        height = width/bgaspect;
    }else{
        height = 6;
        width = height*bgaspect;
    }
    this.bg.setLocalScale(width, 1, height);

    this.scoreui = document.getElementById("score");
    this.awardTimes = 0;
    var pos = this.entity.getPosition();
    this.InitPos = new pc.Vec3(pos.x, pos.y, pos.z);

    this.coins = 0;
    this.award = 0;

    this.controllistener = this.ControlPlayer.bind(this);
    if (app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.controllistener, this);
    } else {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.controllistener, this);
    }

    //needInit
    this.nextDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXDir;
    this.nextPos = new pc.Vec3(0, 0, 0);
    this.jumpup = false;

    this.score = 0;
    this.step = 0;

    this.jptimer = 0;
    this.timeoutlose = false;

};

PlayerControl.prototype.update = function(dt) {
    if (!this.gamemanager.start || !this.gamemanager.startgame) {
        return;
    }

    if (this.gamemanager.lose) {
        if (!this.timeoutlose) {
            this.shadow.model.enabled = false;
            this.ApplyGravity(dt);
        } else {
            this.jptimer += dt;
            if (this.jptimer > 0.1) {
                this.entity.translate(0, -8 * dt, 0);
            } else {
                this.shadow.model.enabled = false;
            }
        }
        return;
    }

    this.Jump(dt);
};


PlayerControl.prototype.Jump = function(dt) {
    if (this.jumpup) {
        this.jptimer += dt;
        if (this.jptimer > this.JumpTime) {
            this.JumpEnd();
        } else {
            if (this.gamemanager.lose) {
                this.shadow.model.enabled = false;
            }
            if (this.jptimer < this.JumpTime / 2) {
                this.entity.translate(-(this.nextDir ? this.Hstep / this.JumpTime * dt : 0), (this.Vstep + 0.2) * 2 / this.JumpTime * dt, -(this.nextDir ? 0 : this.Hstep / this.JumpTime * dt));
                this.shadow.setPosition(this.nextDir ? (this.nextPos.x + this.Hstep + 0.02) : (this.nextPos.x + 0.02), this.nextPos.y - this.Vstep + 0.13, this.nextDir ? (this.nextPos.z + 0.05) : (this.nextPos.z + this.Hstep + 0.05));
                this.shadow.setLocalScale(0.1 + 0.4 * (this.JumpTime / 2 - this.jptimer) / this.JumpTime, 0.1 + 0.4 * (this.JumpTime / 2 - this.jptimer) / this.JumpTime, 0.1 + 0.4 * (this.JumpTime / 2 - this.jptimer) / this.JumpTime);
            } else {
                this.entity.translate(-(this.nextDir ? this.Hstep / this.JumpTime * dt : 0), -0.4 / this.JumpTime * dt, -(this.nextDir ? 0 : this.Hstep / this.JumpTime * dt));
                this.shadow.setPosition(this.nextPos.x + 0.02, this.nextPos.y + 0.13, this.nextPos.z + 0.05);
                this.shadow.setLocalScale(0.1 + 0.4 * (this.jptimer - this.JumpTime / 2) / this.JumpTime, 0.1 + 0.4 * (this.jptimer - this.JumpTime / 2) / this.JumpTime, 0.1 + 0.4 * (this.jptimer - this.JumpTime / 2) / this.JumpTime);
            }

        }
    }


};

PlayerControl.prototype.ApplyGravity = function(dt) {

    this.jptimer += dt;

    if (this.jptimer < this.JumpTime / 2) {
        this.entity.translate(-(!this.nextDir ? this.Hstep / this.JumpTime * dt : 0), (this.Vstep + 0.1) * 2 / this.JumpTime * dt, -(!this.nextDir ? 0 : this.Hstep / this.JumpTime * dt));
    } else {
        if (this.jptimer < this.JumpTime) {
            this.entity.translate(-(!this.nextDir ? this.Hstep / this.JumpTime * dt : 0), -0.2 / this.JumpTime * dt, -(!this.nextDir ? 0 : this.Hstep / this.JumpTime * dt));
        } else {
            this.entity.translate(0, -10 * dt, 0);
        }
    }


};

PlayerControl.prototype.ControlPlayer = function(e) {

    if (!this.gamemanager.start) {
        return;
    }

    if (!this.gamemanager.startgame) {
        this.tips.enabled = false;
        this.gamemanager.startgame = true;

        this.gamemanager.GameStartGame();
    }

    if (this.gamemanager.lose) {
        return;
    }
    if (e) {
        e.event.preventDefault();
    }
    var Ldir = false;
    if (e.touches === null) {
        if (e.x < this.halfscreenwidth) {
            Ldir = true;
        }
    } else {
        if (e.touches[0].x < this.halfscreenwidth) {
            Ldir = true;
        }
    }

    if (Ldir) {
        Ldir = true;
        this.playermat.emissiveMap = this.Ltex;
        this.playermat.opacityMap = this.Ltex;
        this.playermat.update();
        this.shadow.setEulerAngles(0, -45, 0);
    } else {
        this.playermat.emissiveMap = this.Rtex;
        this.playermat.opacityMap = this.Rtex;
        this.playermat.update();
        this.shadow.setEulerAngles(0, 45, 0);
    }
    if (this.jumpup) {
        this.JumpEnd();
    }

    if ((this.nextDir && Ldir) || (!this.nextDir && !Ldir)) {
        this.score++;
        this.award++;
        this.step++;
        this.scoreui.innerHTML = this.score.toString();

        this.jumpup = true;
        this.nextPos.set(this.nextDir ? this.nextPos.x - this.Hstep : this.nextPos.x, this.nextPos.y + this.Vstep, this.nextDir ? this.nextPos.z : this.nextPos.z - this.Hstep);
        this.pathmanager.SpanBox();
    } else {
        this.gamemanager.lose = true;
        this.shadow.model.enabled = false;
        this.PlaySound("lose");
            
    }
};

PlayerControl.prototype.PlaySound = function(name) {
    this.entity.sound.slot(name).play();
};

PlayerControl.prototype.JumpEnd = function() {
    this.entity.setPosition(this.nextPos.x, this.nextPos.y, this.nextPos.z);
    this.jptimer = 0;
    this.jumpup = false;
    this.pathmanager.playerindex = Math.round(this.step % this.pathmanager.prefabsNum);
    this.shadow.setLocalScale(0.3, 0.3, 0.3);

    var boxcontrol = this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl;
    if (boxcontrol.hascoin) {
        this.PlaySound('eat');
        boxcontrol.hascoin = false;
        this.pathmanager.coinprops[boxcontrol.coinindex].enabled = false;
        this.coins++;
        //吃到牛奶加5分
        this.score = this.score + 5;
        this.award = this.award + 5;
        this.scoreui.innerHTML = this.score.toString();
    }

    var nextIndex = 0;
    if (this.pathmanager.playerindex < this.pathmanager.prefabsNum - 1) {
        nextIndex = this.pathmanager.playerindex + 1;
    }
    this.nextDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.spanXDir;
};


PlayerControl.prototype.Reborn = function() {
    this.gamemanager.lose = false;
    this.timeoutlose = false;
    this.body.model.enabled = true;
    this.shadow.model.enabled = true;
    this.score++;
    this.award++;
    this.step++;
    this.scoreui.innerHTML = this.score.toString();
    this.nextPos.set(this.nextDir ? this.nextPos.x - this.Hstep : this.nextPos.x, this.nextPos.y + this.Vstep, this.nextDir ? this.nextPos.z : this.nextPos.z - this.Hstep);
    this.pathmanager.timer = -2;
    this.JumpEnd();
    this.shadow.setPosition(this.nextPos.x, this.nextPos.y +0.13,  this.nextPos.z );
    this.pathmanager.SpanBox();

};

PlayerControl.prototype.Init = function() {
    this.coins = 0;
    this.nextDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXDir;
    this.nextPos.set(0, 0, 0);
    this.jumpup = false;
    this.score = 0;
    this.award = 0;
    this.step = 0;

    this.jptimer = 0;
    this.timeoutlose = false;
    this.body.model.enabled = true;
    this.shadow.model.enabled = true;
    this.shadow.setPosition(0.02, 0.13, 0.05);
    this.shadow.setLocalScale(0.3, 0.3, 0.3);
    this.entity.setPosition(this.InitPos.x, this.InitPos.y, this.InitPos.z);

    
    this.playermat.emissiveMap = this.Rtex;
    this.playermat.opacityMap = this.Rtex;
    this.playermat.update();
    this.shadow.setEulerAngles(0, 45, 0);
};