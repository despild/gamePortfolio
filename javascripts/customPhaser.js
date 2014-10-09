var pg = new Phaser.Game(800,600,Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
var player, tap;
var jumped;
var map;
var tileset;
var layer1, layer2;
var tiles, tiles2;
function preload(){

   
    pg.load.image('bg','./assets/sprites/roze.jpg');
    pg.load.spritesheet('player','./assets/sprites/mummy37x45.png',37,45,18);
    //pg.load.tilemap('mario', './assets/tilemaps/maps/testTile.json',null,Phaser.Tilemap.TILED_JSON);
    //pg.load.tilemap('mario', './assets/tilemaps/maps/super_mario.json',null,Phaser.Tilemap.TILED_JSON);
    pg.load.tilemap('mario', './assets/tilemaps/maps/testTile2.json',null,Phaser.Tilemap.TILED_JSON);
    //pg.load.image('tiles','./assets/tilemaps/tiles/super_mario.png');
    pg.load.image('tiles','./assets/tilemaps/tiles/kenney.png');

    //pg.load.image('tap','./assets/sprites/tap.png');
}

function create(){
    //pg.world.setBounds(0,0,800,600);
    pg.physics.startSystem(Phaser.Physics.NINJA);
    pg.physics.startSystem(Phaser.Physics.ARCADE);
    pg.physics.ninja.gravity.y = 500;

    //pg.stage.backgroundColor = '#FA34BB';
    pg.add.sprite(0,0,'bg');    

  

    //tilemap test
    map = pg.add.tilemap('mario');
    var slopeMap = { '4':1,'108':1,'20':1,'5':1,'47':1,'26':1,'45':1,'66':1,'87':1,'130':1,'25':3, '129':2,'46':32,'67':32,'88':32,'109':32};
    //map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    map.addTilesetImage('indexWorld', 'tiles');
    tiles = pg.physics.ninja.convertTilemap(map,layer1,slopeMap);
    tiles2 = pg.physics.ninja.convertTilemap(map,layer2,slopeMap);
    // map.setCollisionBetween(14, 15);
    // map.setCollisionBetween(15, 16);
    // map.setCollisionBetween(20, 25);
    // map.setCollisionBetween(27, 29);
    // map.setCollision(40);

    map.setCollisionBetween(1,131);

    layer1 = map.createLayer('World1');

    //layer.debug = true;
    layer1.resizeWorld();

    //layer2 = map.createLayer('World2');
    //layer2.resizeWorld();


    //tap = pg.add.sprite(100,560,'tap');
    //pg.physics.ninja.enable(tap);

    //tap.body.collideWorldBounds = true;

  player = pg.add.sprite(400,30,'player',5);
    pg.physics.ninja.enable(player);
    pg.physics.arcade.enable(player);
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    player.anchor.setTo(0.5,0.5);
    player.scale.setTo(1.0,1.0);

    player.animations.add('walk');
    //player.body.offset.y +=5;
    //player.body.height -=10;
    player.body.width -=20;
    pg.camera.follow(player);
    

}

function update(){
    map.setLayer('World2');
    
    //pg.physics.ninja.collide(player, layer);
    //pg.physics.ninja.collide(player, tap);
    for(var i = 0 ; i<tiles.length; i++){
        player.body.aabb.collideAABBVsTile(tiles[i].tile);
    }
    player.body.velocity.x = 0;
    if(pg.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
            player.body.moveLeft(50);
        }else{
            player.body.moveLeft(20);
        }
        player.scale.setTo(-1.0,1.0);
        if(!player.animations.getAnimation('walk').isPlaying){
            player.animations.play('walk',true);

        }

    }  else if(pg.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        if(pg.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
            player.body.moveRight(50);
        }else{
            player.body.moveRight(20);
        }
        player.scale.setTo(1.0,1.0);
        if(!player.animations.getAnimation('walk').isPlaying){
            player.animations.play('walk',true);

        }

    }
    if(pg.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        player.body.moveUp(50);
        //player.body.velocity.y = -300;
        
        
    }

    if(pg.input.keyboard.justReleased(Phaser.Keyboard.LEFT)||pg.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
        player.animations.stop('walk');
    }
    if(pg.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        jumped = false;
    }
    
}


function render(){

    pg.debug.body(player);
}
