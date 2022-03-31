var BoxControl = pc.createScript('BoxControl');

//用于控制方块的掉落
BoxControl.prototype.initialize = function() {
    this.spanXDir = true;
    this.hasChildren = false;
    this.childrenNode = null;
    this.Up = false;
    this.Down = false;
    this.UpSpeed = 20;
    this.DownSpeed = 8;
    this.UpTime = 0.2;
    this.DownTime = 0.5;
    this.timer = 0;
    this.NextPos = new pc.Vec3(0, 0, 0);
    this.childrenPos = new pc.Vec3(0, 0, 0);
    this.hascoin = false;
    this.coinindex = 0;
};

BoxControl.prototype.update = function(dt) {

    if (this.Up) {
        this.timer += dt;
        if (this.timer > this.UpTime) {
            this.entity.setPosition(this.NextPos.x, this.NextPos.y, this.NextPos.z);
            if (this.hasChildren) {
                this.childrenNode.setPosition(this.childrenPos.x, this.childrenPos.y, this.childrenPos.z);
            }
            this.Up = false;
            this.timer = 0;
        } else {
            this.entity.translate(0, -this.UpSpeed * dt, 0);
            if (this.hasChildren ) {
                this.childrenNode.translate(0, -this.UpSpeed * dt, 0);
            }

        }
    }


    if (this.Down) {
        this.timer += dt;
        if (this.timer > this.DownTime) {
            this.hasChildren = false;
            this.childrenNode = null;
            this.Down = false;
            this.timer = 0;
        } else {
            this.entity.translate(0, -this.DownSpeed * dt, 0);
            if (this.hasChildren) {
                this.childrenNode.translate(0, -this.DownSpeed * dt, 0);
            }
        }
    }
};