var UIManager = pc.createScript('UIManager');

UIManager.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName("Manager");
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    var curcamera = app.root.findByName("Camera");
    this.camerafollow = curcamera.script.CameraFollow;
    var player = app.root.findByName("player");
    this.playercontrol = player.script.PlayerControl;
    this.showEndUI = false;
    this.tips = app.root.findByName("tips");


    var div = document.createElement("div");

    div.innerHTML = "<div id = 'uistart'>" +
        "<button id = 'start' >start</button>" +
        "</div>" +
        "<div id = 'uiend'>" +
        "<button id = 'loadscene'>restart</button>" +
        "<button id = 'revive'>revive</button>"+
        "</div>" +
        "<p id = 'score'>0</p>" +

        "<div id = 'uitimes'>" +
        "</div>" +
        
        "</div>";
    document.body.appendChild(div);

    var style = document.createElement("style");

    style.innerHTML = "#start{ position:absolute;left:38%;top:60%; width:24%;height:auto;color:#000000;}" +
        "#uiend{display:none;}" +
        "#loadscene { position:absolute;left:61%;top:60%; width:24%;height:auto;color:#000000;}" +
        "#revive { position:absolute;left:16%;top:60%; width:24%;height:auto;color:#000000;}" +
        "#score{position: absolute;width: 100%;top: 5%;color: #fff;font-size: 40px;text-align: center; font-family: initial;display:none;}" +
        "@media screen and (max-width : 320px) { #score{ font-size:3.3em;}}";
    document.head.appendChild(style);
    //document.head.appendChild(style);


    var self    = this;
    var again   = document.getElementById("loadscene");
    var uistart = document.getElementById("uistart");
    var start   = document.getElementById("start");
    var revive  = document.getElementById('revive');
    
    this.uiend  = document.getElementById("uiend");
    this.score  = document.getElementById("score");


    again.addEventListener('click', function(event) {
        //uistart.style.display = "block";
        self.uiend.style.display = "none";
        //self.score.style.display = "none";
        self.score.innerHTML = "0";
        self.tips.enabled = true;
        self.gamemanager.Init();
        self.pathmanager.Init();
        self.camerafollow.Init();
        self.playercontrol.Init();
        self.Init();
    });

    start.addEventListener('click', function(event) {
        self.tips.enabled = true;
        self.gamemanager.start = true;
        self.gamemanager.GameStart();
        self.score.style.display = "block";
        uistart.style.display = "none";
    });

    revive.addEventListener('click',function(event){
       
        self.uiend.style.display="none";
        self.gamemanager.Revive();
        self.Init();
        
    });
    
    

    this.losetimer = 0;

};

// Called every frame, dt is time in seconds since last update
UIManager.prototype.update = function(dt) {
    if (this.gamemanager.lose) {
        this.losetimer += dt;
        if (this.losetimer > 0.5 && !this.showEndUI) {
            this.uiend.style.display = "block";
            this.gamemanager.GameEnd();
            this.showEndUI = true;
        }
    }

};

UIManager.prototype.Init = function() {
    this.losetimer = 0;
    this.showEndUI = false;
};