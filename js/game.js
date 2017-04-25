//-----------------------------------------------------------------------------
//Global Variables
//-----------------------------------------------------------------------------

var backgroundColor = "#ADADAD";
var rectangleColor  = "#3884FF";

var rectangle1;
var rectangle2;
var rectangle3;

var placeStart_bool  = false;
var placeFinish_bool = false;

var start;
var finish;

var startX;
var startY;

var finishX;
var finishY;


//-----------------------------------------------------------------------------
//Phaser Game Functionality
//-----------------------------------------------------------------------------

//mapping phaser game to var
var game = new Phaser.Game(500, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

//Preload
//-----------------------------------------------------------------------------
//preload assets needed for game
function preload() {

    game.load.spritesheet('background', 'assets/background.png',500,500);

    game.load.spritesheet('rectangle1', 'assets/rectangle1.png',200,200);
    game.load.spritesheet('rectangle2', 'assets/rectangle2.png',150,150);
    game.load.spritesheet('rectangle3', 'assets/rectangle3.png',100,100);


    game.load.spritesheet('start', 'assets/start.png',10,10);
    game.load.spritesheet('finish', 'assets/finish.png',10,10);


    game.load.spritesheet('start_button', 'assets/start_button.png',100,50);
    game.load.spritesheet('finish_button', 'assets/finish_button.png',100,50);

}

//Create
//-----------------------------------------------------------------------------
//create initial assets for game
function create() {

    game.add.sprite(0,0, 'background');

    game.world.setBounds(0,0,500,500);
    game.stage.backgroundColor = backgroundColor;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    rectangle1 = game.add.sprite(10,100,'rectangle1');
    rectangle2 = game.add.sprite(300,200,'rectangle2');
    rectangle3 = game.add.sprite(300,10,'rectangle3');

    rectangle1.inputEnabled = true;
    rectangle1.input.enableDrag();

    rectangle2.inputEnabled = true;
    rectangle2.input.enableDrag();

    rectangle3.inputEnabled = true;
    rectangle3.input.enableDrag();

    //-------------------------------------------------------

    game.add.button(0, 450, 'start_button', addStart, this, 0, 0, 1, 0);
    game.add.button(120, 450, 'finish_button', addFinish, this, 0, 0, 1, 0);
}

//Update
//-----------------------------------------------------------------------------
//main update loop
var frameDelay = 0;
function update() {

    frameDelay++;

    if(frameDelay > 6) {
        if(placeStart_bool){
            if(game.input.activePointer.isDown && game.input.mousePointer.x < 500){
                // TODO add checking to not place start on a rectangle
                if( confirmPlacement() )
                    addStartSprite(game);

                placeStart_bool = false;
            }
        }

        if(placeFinish_bool){
            if(game.input.activePointer.isDown && game.input.mousePointer.x < 500){
                // TODO add checking to not place finish on a rectangle
                if( confirmPlacement() )
                    addFinishSprite(game);

                placeFinish_bool = false;

                calculatePath();
            }
        }

        frameDelay = 0;
    }
}

//Render
//-----------------------------------------------------------------------------
//used to render 
function render() {

}

//-----------------------------------------------------------------------------
// Listener Functions
//-----------------------------------------------------------------------------

function addStart(){
   placeStart_bool = true;
}

function addFinish(){
    placeFinish_bool = true;
}

//-----------------------------------------------------------------------------
// Supporting Functions
//-----------------------------------------------------------------------------

function addStartSprite(game){
    //spawn light source at click location, and add to array
    start = game.add.sprite(game.input.x, game.input.y, 'start');

    start.inputEnabled = true;
    start.input.useHandCursor = true;

    startX = game.input.x;
    startY = game.input.y;

    start.events.onInputDown.add(destroySprite, this);
}

function addFinishSprite(game){
    //spawn light source at click location, and add to array
    finish = game.add.sprite(game.input.x, game.input.y, 'finish');

    finish.inputEnabled = true;
    finish.input.useHandCursor = true;

    finishX = game.input.x;
    finishY = game.input.y;

    finish.events.onInputDown.add(destroySprite, this);
}

function destroySprite (sprite) {
    sprite.destroy();
}

function confirmPlacement(){
    return true;
}

function calculatePath(){

}