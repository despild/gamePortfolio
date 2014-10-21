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
var isFadeEnded=true;
var fromTween, toTween;

var testButton; 
function preload(){

    pg.load.image('ball','./assets/sprites/aqua_ball.png');
    pg.load.spritesheet('player','./assets/sprites/player16x16x7.png',16,16,7);
    pg.load.tilemap('map00', './assets/tilemaps/maps/lobby.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.tilemap('map01', './assets/tilemaps/maps/stage01.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.image('tiles','./assets/tilemaps/tiles/tileSF20x20x5.png');
    pg.load.image('starfield','./assets/sprites/starfield.png');
    pg.load.image('door','./assets/sprites/lobbyDoorProto.png');

}

function create(){

    pg.physics.startSystem(Phaser.Physics.ARCADE);
    pg.physics.arcade.gravity.y = 500;

    device = new Phaser.Device();

    pg.stage.backgroundColor = '#000';
    starfield = pg.add.tileSprite(0,0,800,600, 'starfield');
    door1 = pg.add.sprite(20,40,'door');
    door2 = pg.add.sprite(20,360,'door');
    door3 = pg.add.sprite(520,40,'door');
    door4 = pg.add.sprite(520,360,'door');

    maps.push(pg.add.tilemap('map00'));
    maps.push(pg.add.tilemap('map01'));

    for(var i = 0 ;i<maps.length;i++){
        maps[i].addTilesetImage('indexWorld','tiles');
        maps[i].setCollisionBetween(1,5);
    }
  
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
    stage01Group = pg.add.group();
    stage01Group.add(layers[1]);

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
        testButton = pg.add.sprite(400,580,'ball',5);
        testButton.anchor.setTo(0.5,0.5);
        testButton.width += 10;
        testButton.height += 10;
        testButton.inputEnabled = true;
        testButton.events.onInputDown.add(jump, this);
    }
}

function update(){
    if(fromTween !=null && toTween !=null ){
        if(!fromTween.isRunning && !toTween.isRunning){
            isFadeEnded = true;
        }
    }
    player.body.velocity.x = 0;
 
    pg.physics.arcade.collide(player, layers[stage]); 
    
    if(pg.input.keyboard.isDown(Phaser.Keyboard.ONE)){
        stage =0;
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.ESC)){
        stage =1;
    }

    if(pg.input.keyboard.isDown(Phaser.Keyboard.UP)){
        console.log(isFadeEnded);
        if(stage===0){
            if(player.body.x>80&&player.body.x<220){
                if(player.body.y>100 && player.body.y<260){

                        stageFade(0,1);
                    
                }
            }
        }else if(stage===1){

                stageFade(1,0);

        }
        
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        
    }

    if(pg.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if(player.body.onFloor()){
            player.body.velocity.y = -430;
        }
    }
    if(pg.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                player.body.velocity.x = -150;
            }else{
            player.body.velocity.x = -80;
            
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

    }  else if(pg.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
            player.body.velocity.x = 150;
        }else{
            player.body.velocity.x = 80;
            
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
    
}

function fadeOut(sprite){
    pg.add.tween(sprite).to({alpha:0},1000,Phaser.Easing.Linear.None,true);
}
function fadeIn(sprite){
    pg.add.tween(sprite).to({alpha:1},1000,Phaser.Easing.Linear.None,true);
}

function jump(){
     if(player.body.onFloor()){
            player.body.velocity.y = -430;
        }
}