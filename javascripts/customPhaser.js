var pg = new Phaser.Game(800,600,Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
var starfield;
var player;
var maps=[];
var layers=[];
var stage=0;
function preload(){


    pg.load.spritesheet('player','./assets/sprites/player16x16x7.png',16,16,7);
    pg.load.tilemap('map00', './assets/tilemaps/maps/lobby.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.tilemap('map01', './assets/tilemaps/maps/stage01.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.image('tiles','./assets/tilemaps/tiles/tileSF20x20x5.png');
    pg.load.image('starfield','./assets/sprites/starfield.png');
    console.log("Preload Ended");
}

function create(){

    pg.physics.startSystem(Phaser.Physics.ARCADE);
    pg.physics.arcade.gravity.y = 500;


    starfield = pg.add.tileSprite(0,0,800,600, 'starfield');
    pg.stage.backgroundColor = '#000';

    maps.push(pg.add.tilemap('map00'));
    maps.push(pg.add.tilemap('map01'));
    
   console.log("Tilemap adding Ended"); 

    for(var i = 0 ;i<maps.length;i++){
        maps[i].addTilesetImage('indexWorld','tiles');
        maps[i].setCollisionBetween(1,5);
    }

   
    console.log("collisionSetting Ended");

    
    layers.push(maps[0].createLayer('lobby'));
    layers.push(maps[1].createLayer('stage01'));

    console.log("Creating Layer Ended");

    for(var i = 0 ; i<maps.length ; i++){

        layers[i].resizeWorld();
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

    console.log("Setup Ended");
}

function update(){

    player.body.velocity.x = 0;
 
    stageSetting(stage);   
    
    if(pg.input.keyboard.isDown(Phaser.Keyboard.ONE)){
        stage =0;
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.ESC)){
        stage =1;
    }

    if(pg.input.keyboard.isDown(Phaser.Keyboard.UP)){
        fadeOut(player);
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        fadeIn(player);
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


function fadeOut(sprite){
    pg.add.tween(sprite).to({alpha:0},1000,Phaser.Easing.Linear.None,true);
}
function fadeIn(sprite){
    pg.add.tween(sprite).to({alpha:1},1000,Phaser.Easing.Linear.None,true);
}

function stageSetting(stage){
    for(var i = 0 ; i < layers.length ; i++){
        if(i === stage){
            layers[i].alpha = 1.0;        
        }else{
            layers[i].alpha = 0.0;
        }
        
    }
    
    pg.physics.arcade.collide(player, layers[stage]);


}