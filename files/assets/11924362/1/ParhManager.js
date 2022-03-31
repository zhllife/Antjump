var PathManager = pc.createScript('PathManager');

PathManager.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName("Manager");
    this.gamemanager = manager.script.GameStateManager;
    var player = app.root.findByName("player");
    this.playercontrol = player.script.PlayerControl;
    
    var bgprop = app.root.findByName("bgprop");
    this.bgprops = bgprop.children;
    this.bgpropindex = 0;
    this.bgpropcount = this.bgprops.length;

    var boxprefabs = app.root.findByName("prefabs");
    this.BoxPool = boxprefabs.getChildren();
    this.prefabsNum = this.BoxPool.length;
    this.dropnum = 4;
    this.InitNum = 6;
    this.Hstep = 0.5;
    this.Vstep = 0.25;
    this.DropHeight = 4;
    var prefabs = app.root.findByName("boxprefabs");
    this.BoxChildren = prefabs.getChildren();
    this.childrenNum = this.BoxChildren.length;

    for (var k = 0; k < this.childrenNum; k++) {
        this.BoxChildren[k].setPosition(0, -100, 0);
    }

    var coinprop = app.root.findByName('coins');
    this.coinprops = coinprop.children;
    this.coincount = this.coinprops.length;
    this.coinindex = 0;
    for (var i = 0; i < this.coincount; i++) {
        this.coinprops[i].enabled = false;
    }

    this.playerindex = 0;
    this.dropIndex = 0;
    this.DownIndex = 1;
    this.childrenIndex = 0;

    this.spanXDir = false;
    this.LastPos = new pc.Vec3(0, 0, 0);
    this.BoxPool[0].setPosition(0, 0, 0);
    for (var i = 1; i < this.InitNum; i++) {
        this.InitSpanBox();
    }
    this.everydelay = 0.4;
    this.timer = 0;
    var extranum = this.prefabsNum - this.InitNum;
    for (var j = 0; j < extranum; j++) {
        this.BoxPool[this.DownIndex + j].setPosition(0, -100, 0);
    }

    this.boxchildrenindex = 0;
    this.lastnum = 0;
    this.lastdir = this.spanXDir;

};

PathManager.prototype.update = function(dt) {

    if (!this.gamemanager.start) {
        return;
    }

    if (!this.gamemanager.startgame) {
        return;
    }

    if (this.gamemanager.lose) {
        return;
    }

    this.timer += dt;
    if (this.timer > this.everydelay) {
        this.BoxPool[this.dropIndex].script.BoxControl.Down = true;
        if (this.playerindex === this.dropIndex && !this.playercontrol.jumpup) {
            this.playercontrol.timeoutlose = true;
            this.gamemanager.lose = true;
            this.playercontrol.PlaySound("lose");
        }
        this.timer = 0;
        this.dropIndex++;
        if (this.dropIndex >= this.prefabsNum) {
            this.dropIndex = 0;
        }
    }

};


PathManager.prototype.InitSpanBox = function() {

    this.BoxPool[this.DownIndex].script.BoxControl.spanXDir = this.spanXDir;
    this.BoxPool[this.DownIndex].setPosition(this.spanXDir ? this.LastPos.x - this.Hstep : this.LastPos.x, this.LastPos.y + this.Vstep, this.spanXDir ? this.LastPos.z : this.LastPos.z - this.Hstep);
    var pos = this.BoxPool[this.DownIndex].getPosition();
    this.LastPos.set(pos.x, pos.y, pos.z);
    this.DownIndex++;
    this.spanXDir = pc.math.random(0, 1) > 0.5 ? true : false;

};

PathManager.prototype.SpanBox = function() {
    if (this.DownIndex >= this.prefabsNum) {
        this.DownIndex = 0;
    }

    var box = this.BoxPool[this.DownIndex];
    var boxcontrol = box.script.BoxControl;

    boxcontrol.spanXDir = this.spanXDir;
    var pos1 = new pc.Vec3(this.spanXDir ? this.LastPos.x - this.Hstep : this.LastPos.x, this.LastPos.y + this.Vstep, this.spanXDir ? this.LastPos.z : this.LastPos.z - this.Hstep);
    box.setPosition(pos1.x, pos1.y + this.DropHeight, pos1.z);
    boxcontrol.Up = true;
    boxcontrol.NextPos.set(pos1.x, pos1.y, pos1.z);
    boxcontrol.hasChildren = false;

    if (this.playercontrol.step % 10 === 0) { //每10步出现金币
        var hascoin1 = pc.math.random(0, 1) > 0.1; //牛奶概率增大
        if (hascoin1) {
            this.coinprops[this.coinindex].enabled = true;
            this.coinprops[this.coinindex].setPosition(pos1.x, pos1.y + 0.3, pos1.z);
            boxcontrol.hascoin = true;
            boxcontrol.coinindex = this.coinindex;
            this.coinindex = this.coinindex >= this.coincount - 1 ? 0 : this.coinindex + 1;
        } 
    }

    //hit 
    var hasChildren1 = (pc.math.random(0, 1) > 0.8) ? true : false; //周围障碍的概率
    if (hasChildren1) {

        if (this.boxchildrenindex >= this.childrenNum) {
            this.boxchildrenindex = 0;
        }
        var childrenpos1 = new pc.Vec3(!this.spanXDir ? this.LastPos.x - this.Hstep : this.LastPos.x, this.LastPos.y + this.Vstep, !this.spanXDir ? this.LastPos.z : this.LastPos.z - this.Hstep);
        boxcontrol.hasChildren = true;
        boxcontrol.childrenNode = null;

        var x = Math.floor(pc.math.random(1, 3)); //BoxChildren pos
        this.BoxChildren[this.boxchildrenindex].setPosition(!this.spanXDir ? (childrenpos1.x - x * this.Hstep) : childrenpos1.x, childrenpos1.y + this.DropHeight, !this.spanXDir ? childrenpos1.z : (childrenpos1.z - x * this.Hstep));
        boxcontrol.childrenPos.set(!this.spanXDir ? (childrenpos1.x - x * this.Hstep) : childrenpos1.x, childrenpos1.y, !this.spanXDir ? childrenpos1.z : (childrenpos1.z - x * this.Hstep));
        boxcontrol.childrenNode = this.BoxChildren[this.boxchildrenindex];
        this.boxchildrenindex++;
    }
    this.spanXDir = pc.math.random(0, 1) > 0.5 ? true : false;
    if ((this.spanXDir && this.lastdir) || (!this.spanXDir && !this.lastdir)) {
        this.lastnum++;
        if (this.lastnum > 3) {
            this.spanXDir = !this.spanXDir;
            this.lastnum = 0;
        }
    }

    this.lastdir = this.spanXDir;
    this.LastPos.set(pos1.x, pos1.y, pos1.z);
    this.DownIndex++;

    //start drop 
    var num = 0;
    if (this.playerindex >= this.dropIndex) {
        num = this.playerindex - this.dropIndex;
    } else {
        num = this.prefabsNum - this.dropIndex + this.playerindex;
    }
    if (num > this.dropnum) {
        this.BoxPool[this.dropIndex].script.BoxControl.Down = true;
        this.dropIndex++;
        if (this.dropIndex >= this.prefabsNum) {
            this.dropIndex = 0;
        }
    }
    
    if (this.playercontrol.step % 20 === 0) { 
        var bgprop = this.bgprops[this.bgpropindex];
        bgprop.enabled = true;    
        bgprop.setPosition(pos1.x,pos1.y,pos1.z);
        var offsetx = (Math.random()>0.5?-1:1)*(Math.random() + 0.5);
        bgprop.translateLocal(offsetx,-6,-3);
        console.log(bgprop.getPosition().toLocaleString());
        this.bgpropindex = this.bgpropindex === this.bgpropcount-1? 0:this.bgpropindex+1;
    }
    //harder  color change
    if (this.playercontrol.step > 0) {
        if (Math.floor(this.playercontrol.step % 50) === 0) {
            //this.playercontrol.PlaySound("change");
            var index = Math.floor(pc.math.random(0, 7));

            if (this.boxcolori == index && this.boxcolori > 0) {
                this.boxcolori -= 1;
            } else {
                this.boxcolori = index;
            }

            if (this.playercontrol.step > 150) {
                this.everydelay = 0.18;
            } else {
                if (this.playercontrol.step > 100) {
                    this.everydelay = 0.2;
                } else {
                    this.everydelay = 0.3;
                }
            }

        }
    }

};

PathManager.prototype.Init = function() {

    this.coinindex = 0;
    for (var i = 0; i < this.coincount; i++) {
        this.coinprops[i].enabled = false;
    }
    this.bgpropindex = 0;
    for (var n = 0; n < this.bgpropcount; n++) {
        this.bgprops[i].enabled = false;
    }
    
    this.everydelay = 0.4;
    this.timer = 0;
    this.playerindex = 0;
    this.dropIndex = 0;
    this.DownIndex = 1;
    this.spanXDir = false;
    this.LastPos.set(0, 0, 0);
    this.BoxPool[0].setPosition(0, 0, 0);
    for (var i = 1; i < this.InitNum; i++) {
        this.InitSpanBox();
    }
    
    var extranum = this.prefabsNum - this.InitNum;
    for (var j = 0; j < extranum; j++) {
        this.BoxPool[this.DownIndex + j].setPosition(0, -100, 0);

    }
    

    for (var n = 0; n < this.prefabsNum; n++) {
        var boxcontrol = this.BoxPool[n].script.BoxControl;
        boxcontrol.hasChildren = false;
        boxcontrol.hascoin = false;
        boxcontrol.childrenNode = null;
    }
    for (var k = 0; k < this.childrenNum; k++) {
        this.BoxChildren[k].setPosition(0, -100, 0);
    }
    this.boxchildrenindex = 0;
    this.lastnum = 0;
    this.lastdir = this.spanXDir;
};