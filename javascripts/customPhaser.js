

var pg = new Phaser.Game(800,600,Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

var device;

var starfield;
var player;
var maps=[];
var layers=[];
var stage=0;
var stageGroups=[];
var door1,door2,door3,door4;
var lobbyGroup, stage01Group;
var fromTween, toTween;
var isLeftDown,isRightDown;
var banner;
var profile = "";

function preload(){

    pg.load.image('ball','./assets/sprites/aqua_ball.png');
    pg.load.spritesheet('player','./assets/sprites/player16x16x7.png',16,16,7);
    pg.load.tilemap('map00', './assets/tilemaps/maps/lobby.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.tilemap('map01', './assets/tilemaps/maps/stage01.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.image('tiles','./assets/tilemaps/tiles/tileSF20x20x5.png');
    pg.load.image('tileStage01','./assets/tilemaps/tiles/stage01Tile20x20x15.png');
    pg.load.image('starfield','./assets/sprites/starfield.png');
    pg.load.image('door','./assets/sprites/lobbyDoorProto.png');
    pg.load.spritesheet('banner','./assets/sprites/banner230x50x7.png',230,50,7);
}

function create(){

    pg.physics.startSystem(Phaser.Physics.ARCADE);
    pg.physics.arcade.gravity.y = 500;
    device = new Phaser.Device();
   
    isLeftDown = false;
    isRightDown = false;


    pg.stage.backgroundColor = '#000';
    starfield = pg.add.tileSprite(0,0,800,600, 'starfield');
    door1 = pg.add.sprite(20,40,'door');
    door2 = pg.add.sprite(20,360,'door');
    door3 = pg.add.sprite(520,40,'door');
    door4 = pg.add.sprite(520,360,'door');

    banner = pg.add.sprite(400,0,'banner');

    banner.anchor.setTo(0.5,0);
    banner.animations.add('load',[0,1,2,3,4,5,6],20);
    banner.animations.play('load');

    maps.push(pg.add.tilemap('map00'));
    maps.push(pg.add.tilemap('map01'));

    // for(var i = 0 ;i<maps.length;i++){
        maps[0].addTilesetImage('indexWorld','tiles');
        maps[0].setCollisionBetween(1,5);
        maps[1].addTilesetImage('indexWorld','tileStage01');
        maps[1].setCollisionBetween(1,9);
        
    // }
  
    layers.push(maps[0].createLayer('lobby'));
    layers.push(maps[1].createLayer('stage01'));

    for(var i = 0 ; i<maps.length ; i++){

        layers[i].resizeWorld();
    }



    lobbyGroup = pg.add.group();
    lobbyGroup.add(layers[0]);
    lobbyGroup.add(door1);
    lobbyGroup.add(door2);
    lobbyGroup.add(door3);
    lobbyGroup.add(door4);
    lobbyGroup.add(banner);
    stage01Group = pg.add.group();
    stage01Group.add(layers[1]);
    var style = {font:"36px Arial", fill:"#CCCCCC", align:"left"};
    var text = pg.add.text(40,40,profile,style);
    stage01Group.add(text);

    stageGroups.push(lobbyGroup);
    stageGroups.push(stage01Group);
    for(var i = 0 ; i <stageGroups.length; i++){
        if(i!=0){
            stageGroups[i].alpha = 0;
        }else{
            stageGroups[i].alpha = 1;
        }
    }


    player = pg.add.sprite(400,30,'player',5);
    pg.physics.arcade.enable(player);
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0.2;
    player.anchor.setTo(0.5,0.5);
    player.scale.setTo(1.0,1.0);

    player.animations.add('front',[0],10);
    player.animations.add('turn',[0,1,2],15);
    player.animations.add('walk',[2,3,4,5],10,true);
    player.animations.add('return',[2,1,0],15);
    player.animations.add('jump',[6],10);

    
    player.body.width -=8
    pg.camera.follow(player);
    
    player.animations.play('front');
 
    if(device.android || device.iOS || device.iPhone || device.iPad){
        var leftButton = pg.add.sprite(100,550,'ball',5);
        var rightButton = pg.add.sprite(250,550,'ball',5);
        var jumpButton = pg.add.sprite(700,550,'ball',5);
        leftButton.anchor.setTo(0.5,0.5);
        leftButton.width += 70;
        leftButton.height += 70;
        rightButton.anchor.setTo(0.5,0.5);
        rightButton.width += 70;
        rightButton.height +=70;
        jumpButton.anchor.setTo(0.5,0.5);
        jumpButton.width += 70;
        jumpButton.height += 70;

        leftButton.inputEnabled = true;
        leftButton.events.onInputDown.add(leftDown, this);
        rightButton.inputEnabled = true;
        rightButton.events.onInputDown.add(rightDown, this);
        jumpButton.inputEnabled = true;
        jumpButton.events.onInputDown.add(jump, this);
        leftButton.events.onInputUp.add(release, this);
        rightButton.events.onInputUp.add(release, this);
    }
}

function update(){
    if(fromTween !=null && toTween !=null ){
        if(!fromTween.isRunning && !toTween.isRunning){
            isFadeEnded = true;
        }
    }

    player.body.velocity.x = 0;

    if(isLeftDown){
        left();
    }
    if(isRightDown){
        right();
    }

    //Stage Gravity Setting
    if(stage===0){
        player.body.allowGravity = true;
    }else if(stage===1){
        if(player.body.y > 125 && player.body.x > 660 && player.body.x <700){
            player.body.allowGravity = false;
            player.body.velocity.y=0;
        }else{
            player.body.allowGravity = true;
        }
    }


    pg.physics.arcade.collide(player, layers[stage]); 
    
    if(pg.input.keyboard.isDown(Phaser.Keyboard.ONE)){
        stage =0;
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.ESC)){
        stage =1;
    }

    if(pg.input.keyboard.isDown(Phaser.Keyboard.UP)){
        if(fromTween ===undefined || toTween ===undefined){

            if(stage===0){
                if(player.body.x>80&&player.body.x<220){
                    if(player.body.y>100 && player.body.y<260){

                            stageFade(0,1);
                    }
                }
            }else if(stage===1){
                if(player.body.x >740 && player.body.x < 780){
                    if(player.body.y >70 &&player.body.y <130 ){
                        stageFade(1,0);
                    }

                }
                if(player.body.x > 660 && player.body.x < 700){
                        if(player.body.y >123 && player.body.y < 575){
                            player.body.velocity.y = -100;
                        }
                    }
            }
        }else{
            if(!fromTween.isRunning && !toTween.isRunning){

                if(stage===0){
                    if(player.body.x>80&&player.body.x<220){
                        if(player.body.y>100 && player.body.y<260){

                            stageFade(0,1);
                        }
                    }
                }else if(stage===1){
                    if(player.body.x >740 && player.body.x < 780){
                        if(player.body.y >70 &&player.body.y <130 ){
                            stageFade(1,0);
                        }
                    }
                    if(player.body.x > 660 && player.body.x < 700){
                        if(player.body.y >123 && player.body.y < 575){
                            player.body.velocity.y = -100;
                        }
                    }
                }

            }

        }
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        if(stage ===1){
            if(player.body.x >660 && player.body.x < 700){
                player.body.velocity.y =100;
                // if(player.body.onFloor()){
                //     player.body.velocity.y = 0;
                // }
            }
        }
    }

    if(pg.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        jump();
    }
    if(pg.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        left();

    }  else if(pg.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        right();
    }

    if(pg.input.keyboard.justReleased(Phaser.Keyboard.LEFT)||pg.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
        player.animations.stop('walk');
        player.animations.play('return');
    }
    if(pg.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        jumped = false;
    }

}


function render(){

    //pg.debug.body(player);
    pg.debug.bodyInfo(player,30,30);
}

function stageFade(from, to){
    if(fromTween ===undefined || toTween ===undefined){
        fromTween = pg.add.tween(stageGroups[from]).to({alpha:0},1000,Phaser.Easing.Linear.None,true);
        toTween = pg.add.tween(stageGroups[to]).to({alpha:1},1000,Phaser.Easing.Linear.None,true);
        stage = to;
    }else{
        if(!fromTween.isRunning && !toTween.isRunning){
            fromTween = pg.add.tween(stageGroups[from]).to({alpha:0},1000,Phaser.Easing.Linear.None,true);
            toTween = pg.add.tween(stageGroups[to]).to({alpha:1},1000,Phaser.Easing.Linear.None,true);
            stage = to;
        }
    }

    if(from === 0){
        if(to === 1){
            player.body.x = 760;
            player.body.y = 130;
            pg.add.tween(player).to({alpha:0},10,Phaser.Easing.Linear.None,true)
            .to({alpha:1},10,Phaser.Easing.Linear.None,true);
        }
    }else if(from === 1){
        if(to === 0){
            player.body.x = 150;
            player.body.y = 243;
        }
    }
    
}

function fadeOut(sprite){
    pg.add.tween(sprite).to({alpha:0},1000,Phaser.Easing.Linear.None,true);
}
function fadeIn(sprite){
    pg.add.tween(sprite).to({alpha:1},1000,Phaser.Easing.Linear.None,true);
}

function jump(){
    if(stage === 1){
        
    }
     if(player.body.onFloor()){
            player.body.velocity.y = -430;
        }
}

function left(){
    if(device.android || device.iOS || device.iPhone || device.iPad){
        player.body.velocity.x = -150;
    }else{
        if(stage === 0){
            if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                player.body.velocity.x = -150;
            }else{
                player.body.velocity.x = -80;
            }
        }else if(stage === 1){
            if(player.body.y >126){
                
            }else{
                
                if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                    player.body.velocity.x = -150;
                }else{
                    player.body.velocity.x = -80;
             
                }
            }


        }else if(stage ===2){

        }else if(stage ===3){

        }else if(stage ===4){

        }else{
            
        }

    }
    player.scale.setTo(-1.0,1.0);
    if(!player.animations.getAnimation('turn').isFinished){
        player.animations.play('turn');
    }else{
        if(player.body.onFloor()){
            if(!player.animations.getAnimation('walk').isPlaying && player.body.onFloor()){
                player.animations.play('walk',true);
            }
        }else{
            player.animations.play('jump');
        }
        
    }
}

function right(){
    if(device.android || device.iOS || device.iPhone || device.iPad){
        player.body.velocity.x = 150;
    }else{
        if(stage === 0){
            if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                player.body.velocity.x = 150;
            }else{
                player.body.velocity.x = 80;
            }
        }else if(stage === 1){
            if(player.body.y >126){
                
            }else{
                
                if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                    player.body.velocity.x = 150;
                }else{
                    player.body.velocity.x = 80;
             
                }
            }


        }
    }
    player.scale.setTo(1.0,1.0);
    if(!player.animations.getAnimation('turn').isFinished){
        player.animations.play('turn');
    }else{
        if(player.body.onFloor()){
            if(!player.animations.getAnimation('walk').isPlaying && player.body.onFloor()){
                player.animations.play('walk',true);
            }
        }else{
            player.animations.play('jump');
        }
    }
}

function release(){
    player.animations.stop('walk');
    player.animations.play('return');
    isLeftDown = false;
    isRightDown =false;
}

function leftDown(){
    isLeftDown = true;
}

function rightDown(){
    isRightDown = true;
}