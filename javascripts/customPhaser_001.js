var pg = new Phaser.Game(800,600,Phaser.AUTO, '', {preload: preload, create: create, update: update});

var sprite;
var tween;
var st;
var mummy1,mummy2;
function preload(){
    pg.world.setBounds(0,0,800,600);
    pg.load.image('diamond', './assets/diamond.png');
    pg.load.spritesheet('mummy','./assets/metalslug_mummy37x45.png',37,45,18);
}
function create(){


    //pg.physics.enable(sprite,Phaser.Physics.ARCADE);
    //pg.stage.backgroundColor = 0x000000;
    mummy1= pg.add.sprite(100,300,'mummy',5);
    mummy2= pg.add.sprite(400,300,'diamond', 10);
    mummy1.animations.add('walk');
    mummy1.animations.add('rewind',[17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]);
    mummy1.inputEnabled=true;
    mummy1.input.enableDrag(true);

    mummy1.events.onInputDown.add(mummyClick, this);
    mummy1.events.onInputUp.add(mummyUp,this);
    //mummy1.animations.play('rewind',10,true);
    

    /*
    sprite = pg.add.sprite(pg.world.centerX, pg.world.centerY, 'diamond');
    pg.physics.enable(sprite, Phaser.Physics.ARCADE);
    
    var d1 =pg.add.sprite(100,100,'diamond');
    d1.inputEnabled = true;
    d1.input.enableDrag(true);
    d1.input.useHandCursor = true;
    d1.input.priorityID = 1;

    //d1.events.onInputUp.add(d1Up, this);
    d1.events.onInputDown.add(d1Down, this);
    d1.events.onInputOver.add(d1Over, this);
    d1.events.onInputOut.add(d1Out, this);

    tween = pg.add.tween(d1).to({x:700}, 4000, Phaser.Easing.Linear.None,true)
	.to({x:0},4000,Phaser.Easing.Linear.None,true)
	.loop();
    //tween.start();
    
    */

}

function update(){
    if(pg.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
	//st.play(10,true);
	if(!mummy1.animations.paused){
	    mummy1.animations.play('rewind',10,true);
	}	
	mummy1.x -= 2;
    }else if(pg.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	//st.play(10,true);
	if(!mummy1.animations.paused){
	    mummy1.animations.play('walk',10,true);
	}
	mummy1.x += 2;
    }
    if(pg.input.keyboard.justReleased(Phaser.Keyboard.LEFT)||pg.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
	//st.stop(false);
	mummy1.animations.stop('walk');
	mummy1.animations.stop('rewind');
    }
    
}

function mummyUp(){
    mummy1.animations.stop('walk');
    pg.add.tween(mummy1.scale).to({x:1,y:1},800,Phaser.Easing.Elastic.Out,true);
}
function mummyClick(){
    //if(!mummy1.animations.paused){
    pg.add.tween(mummy1.scale).to({x:2, y:2},1000,Phaser.Easing.Elastic.Out,true);
mummy1.animations.play('walk',10,true);
	//}
}

/*
function update(){
    
    //pg.physics.arcade.moveToPointer(sprite, 1000);
    pg.add.tween(sprite).to({x:pg.input.x, y:pg.input.y},10,Phaser.Easing.Linear.None
).start();
  
  /*    
if(Phaser.Rectangle.contains(sprite.body, pg.input.x, pg.input.y))
	{
	   
}


function d1Down(){
    //tween.stop();
    //tween.pause();
    var link = 'http://google.com';
    
    window.open(link);
}

function d1Over(){
    console.log('http://google.com');
    tween.pause();
  
	console.log(sprite.alpha);
	st = pg.add.tween(sprite).to({alpha:0},500,Phaser.Easing.Linear.None,true);
  
}
function d1Out(){
    tween.resume();
    	st = pg.add.tween(sprite).to({alpha:1},500,Phaser.Easing.Linear.None,true);
    
}

function d1Up(){
    tween.pause();
}


*/