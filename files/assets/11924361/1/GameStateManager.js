var GameStateManager = pc.createScript('GameStateManager');


GameStateManager.prototype.initialize = function() {
    //needInit
    var app = this.app;
    this.start = false;
    this.startgame = false;
    this.lose = false;
    var player = app.root.findByName("player");
    this.playercontrol = player.script.PlayerControl;
    this.playtimer = 0;
    
};

// Called every frame, dt is time in seconds since last update
GameStateManager.prototype.update = function(dt) {
    if (!this.start || !this.startgame) {
        return;
    }

    if (this.lose) {
        return;
    }

    this.playtimer += dt;

};

GameStateManager.prototype.GameStartGame = function() {
    console.log('gamestartgame');
};

GameStateManager.prototype.GameStart = function() {
    console.log("GameStart");
};
//需要用到的最后得分
GameStateManager.prototype.GameEnd = function() {
    console.log("GameEnd");
    console.log("Your Score is  " + this.playercontrol.score);
};



GameStateManager.prototype.Init = function() {
    this.playtimer = 0;
    this.startgame = false;
    this.lose = false;

};

//复活方法
GameStateManager.prototype.Revive = function(){

    this.playercontrol.Reborn();
    
};
