var CameraFollow = pc.createScript('CameraFollow');
CameraFollow.attributes.add('MoveSpeed', {
    type: 'number',
    default: 3
});


CameraFollow.prototype.initialize = function() {
    var app = this.app;
    this.player = app.root.findByName("player");
    this.playercontrol = this.player.script.PlayerControl;
    var manager = app.root.findByName("Manager");
    this.gamemanager = manager.script.GameStateManager;


    this.backgroundColor = ["#423e40", "#bc2849", "#4a7778", "#ffba6f", "#007ebe", "#5c515d", "#1b3b4e", "#ba6689", "#2b1c40", "#db8d41", "#3dadc2"];
    this.nextColor = new pc.Color();
    var pos = this.entity.getPosition();
    this.InitPos = new pc.Vec3(pos.x, pos.y - 1.2, pos.z);
    this.entity.setPosition(this.InitPos.x, this.InitPos.y, this.InitPos.z);
    this.left = 12;
    this.up = 12;
    this.timer = 0;
    this.bgcolori = Math.floor(pc.math.random(0, 11));
    //this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
    this.nextColor.fromString('#2E7E8E');//50BCB7FF//20869AFF
    this.entity.camera.clearColor = new pc.Color(this.nextColor.r, this.nextColor.g, this.nextColor.b, 1);
    this.shaketimer = 0;
    
    
};

CameraFollow.prototype.update = function(dt) {

    if (!this.gamemanager.start) {
        return;
    }

    if (this.gamemanager.lose) {
        if (this.playercontrol.hitlose) {
            this.shaketimer += dt;
            if (this.shaketimer > 0.1 && this.shaketimer < 0.6) {
                this.entity.translate(this.left * dt, this.up * dt, 0);
                this.left = -this.left;
                if (this.left > 0) {
                    this.left -= 48 * dt;
                }
                this.up = -this.up;
                if (this.up > 0) {
                    this.up -= 48 * dt;
                }
            }
        }
        return;
    }


    var pos1 = this.player.getPosition();
    var pos2 = this.entity.getPosition();
    var x = pc.math.lerp(pos2.x, pos1.x + 2, this.MoveSpeed * dt);
    var y = pc.math.lerp(pos2.y, pos1.y + 3.5, this.MoveSpeed * dt);
    var z = pc.math.lerp(pos2.z, pos1.z + 2, this.MoveSpeed * dt);
    this.entity.setPosition(x, y, z);

    if(this.playercontrol.score>50){
        this.nextColor.fromString('#142961');
        var color = this.entity.camera.clearColor;
        var r = pc.math.lerp(color.r, this.nextColor.r, dt * 0.6);
        var g = pc.math.lerp(color.g, this.nextColor.g, dt * 0.6);
        var b = pc.math.lerp(color.b, this.nextColor.b, dt * 0.6);
        this.entity.camera.clearColor = new pc.Color(r, g, b, 1);
    }
//     this.timer += dt;
//     if (this.timer > 15) {
//         var colori = Math.floor(pc.math.random(0, 11));
//         if (this.bgcolori == colori && this.bgcolori > 0) {
//             this.bgcolori -= 1;
//         } else {
//             this.bgcolori = colori;
//         }

//         this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
//         this.timer = 0;
//     } else {
//         if (this.timer > 5 && this.timer < 10) {

//             var color = this.entity.camera.clearColor;
//             var r = pc.math.lerp(color.r, this.nextColor.r, dt * 0.2);
//             var g = pc.math.lerp(color.g, this.nextColor.g, dt * 0.2);
//             var b = pc.math.lerp(color.b, this.nextColor.b, dt * 0.2);
//             this.entity.camera.clearColor = new pc.Color(r, g, b, 1);
//         }

//     }


};

CameraFollow.prototype.Init = function() {
    this.timer = 0;
    this.bgcolori = Math.floor(pc.math.random(0, 11));
    //this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
    this.nextColor.fromString('#2795AA');
    this.entity.camera.clearColor = new pc.Color(this.nextColor.r, this.nextColor.g, this.nextColor.b, 1);
    this.entity.setPosition(this.InitPos.x, this.InitPos.y, this.InitPos.z);
    this.shaketimer = 0;
    this.left = 12;
    this.up = 12;
};