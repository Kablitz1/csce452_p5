//-----------------------------------------------------------------------------
//Global Variables
//-----------------------------------------------------------------------------

var backgroundColor = "#494949";
var rectangleColor  = "#3884FF";

var rectangle1;
var rectangle2;
var rectangle3;


//-----------------------------------------------------------------------------
//Class Definitions
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
//Phaser Game Functionality
//-----------------------------------------------------------------------------

//mapping phaser game to var
var game = new Phaser.Game(500, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });



//Preload
//-----------------------------------------------------------------------------
//preload assets needed for game
function preload() {

    game.load.spritesheet('rectangle1', 'assets/rectangle1.png',200,200);
    game.load.spritesheet('rectangle2', 'assets/rectangle2.png',150,150);
    game.load.spritesheet('rectangle3', 'assets/rectangle3.png',100,100);

}

//Create
//-----------------------------------------------------------------------------
//create initial assets for game
function create() {

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

    rectangle1.events.onInputDown.add(moveRectangle1, this);
    rectangle2.events.onInputDown.add(moveRectangle2, this);
    rectangle3.events.onInputDown.add(moveRectangle3, this);
}

//Update
//-----------------------------------------------------------------------------
//main update loop

function update() {

}

//Render
//-----------------------------------------------------------------------------
//used to render 
function render() {

}

//-----------------------------------------------------------------------------
// Listener Functions
//-----------------------------------------------------------------------------

function moveRectangle1(){

}

function moveRectangle2(){

}

function moveRectangle3(){

}