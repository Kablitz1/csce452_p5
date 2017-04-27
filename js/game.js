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

var startCount= 0;
var finishCount= 0;



//-----------------------------------------------------------------------------
//Phaser Game Functionality
//-----------------------------------------------------------------------------

//mapping phaser game to var
var game = new Phaser.Game(500, 550, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });
//Preload
//-----------------------------------------------------------------------------
//preload assets needed for game
function preload() {

    game.load.spritesheet('background', 'assets/background.png',500,550);

    game.load.spritesheet('rectangle1', 'assets/rectangle1.png',200,200);
    game.load.spritesheet('rectangle2', 'assets/rectangle2.png',150,150);
    game.load.spritesheet('rectangle3', 'assets/rectangle3.png',100,100);


    game.load.spritesheet('start', 'assets/start.png',10,10);
    game.load.spritesheet('finish', 'assets/finish.png',10,10);


    game.load.spritesheet('start_button', 'assets/start_button.png',100,50);
    game.load.spritesheet('finish_button', 'assets/finish_button.png',100,50);
    game.load.spritesheet('path_button', 'assets/path_button.png',100,50);

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

    game.add.button(0, 500, 'start_button', addStart, this, 0, 0, 1, 0);
    game.add.button(120, 500, 'finish_button', addFinish, this, 0, 0, 1, 0);
    game.add.button(240, 500, 'path_button', addPath, this, 0,0,1,0);
}

//Update
//-----------------------------------------------------------------------------
//main update loop
var frameDelay = 0;
function update() {

    frameDelay++;

    if(frameDelay > 6) {
        if(placeStart_bool){
            if(game.input.activePointer.isDown && game.input.mousePointer.y < 500){
                // TODO add checking to not place start on a rectangle
                if( confirmPlacement(game.input.mousePointer.x ,game.input.mousePointer.y) )
                    addStartSprite(game);

                placeStart_bool = false;
            }
        }

        if(placeFinish_bool){
            if(game.input.activePointer.isDown && game.input.mousePointer.y < 500){
                // TODO add checking to not place finish on a rectangle
                if( confirmPlacement(game.input.mousePointer.x ,game.input.mousePointer.y) )
                    addFinishSprite(game);

                placeFinish_bool = false;
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
function addPath() {
    calculatePath();
}


//-----------------------------------------------------------------------------
// Supporting Functions
//-----------------------------------------------------------------------------

function addStartSprite(game){
    if (startCount > 0)
        return null;
    startCount+=1;
    //spawn light source at click location, and add to array
    start = game.add.sprite(game.input.x, game.input.y, 'start');

    start.inputEnabled = true;
    start.input.useHandCursor = true;

    startX = game.input.x;
    startY = game.input.y;

    start.events.onInputDown.add(destroyStartSprite, this);
}

function addFinishSprite(game){
    if (finishCount > 0)
        return null;
    finishCount+=1;
    //spawn light source at click location, and add to array
    finish = game.add.sprite(game.input.x, game.input.y, 'finish');

    finish.inputEnabled = true;
    finish.input.useHandCursor = true;

    finishX = game.input.x;
    finishY = game.input.y;

    finish.events.onInputDown.add(destroyFinishSprite, this);
}
function destroyStartSprite (sprite) {
    startCount-=1;
    sprite.destroy();
}


function destroyFinishSprite (sprite) {
    finishCount-=1;
    sprite.destroy();
}

function confirmPlacement(mouseX, mouseY){
    var rectangle1Range = calculateRectangle1Area();
    var rectangle2Range = calculateRectangle2Area();
    var rectangle3Range = calculateRectangle3Area();

    if ((rectangle1Range[0][0] < mouseX  && mouseX < rectangle1Range[0][1]) && (rectangle1Range[1][0] < mouseY && mouseY < rectangle1Range[1][1]))
        return false;
    else if((rectangle2Range[0][0] < mouseX  && mouseX < rectangle2Range[0][1]) && (rectangle2Range[1][0] < mouseY && mouseY < rectangle2Range[1][1]))
        return false;
    else if((rectangle3Range[0][0] < mouseX  && mouseX < rectangle3Range[0][1]) && (rectangle3Range[1][0] < mouseY && mouseY < rectangle3Range[1][1]))
        return false;
    else
        return true;
}

//200 x 200
function calculateRectangle1Area(){
    //GET COORDINATES
    var thisX = rectangle1.x;
    var thisY = rectangle1.y;
    //GENERATE RANGE
    var xRange = [thisX, thisX+200];
    var yRange = [thisY, thisY+200];

    return [xRange,yRange]

}

//150 x 150
function calculateRectangle2Area(){
    //GET COORDINATES
    var thisX = rectangle2.x;
    var thisY = rectangle2.y;
    //GENERATE RANGE
    var xRange = [thisX, thisX+150];
    var yRange = [thisY, thisY+150];

    return [xRange,yRange]
}

//100 x 100
function calculateRectangle3Area(){
    //GET COORDINATES
    var thisX = rectangle3.x;
    var thisY = rectangle3.y;
    //GENERATE RANGE
    var xRange = [thisX, thisX+100];
    var yRange = [thisY, thisY+100];

    return [xRange,yRange]
}

//USING THE RANGES CREATE AN ARRAY OF POINTS THAT DON'T INCLUDE WHERE THE SQUARES ARE
function generateNodeArray() {
    var nodesArray = [];
    for (var x = 0; x < 500; x=x+10)
    {
        for(var y = 0; y < 500; y=y+10)
        {
            if(confirmPlacement(x,y))
            {
                nodesArray.push([x,y]);
            }
        }
    }

    return nodesArray;
}

function inNodesArray(nodesArray,thisPoint) {

    if(thisPoint[0] < 0 || thisPoint[1] < 0)
        return false;
    for(var x = 0; x< nodesArray.length; x++)
    {
        if(thisPoint[0] == nodesArray[x][0] && thisPoint[1] == nodesArray[x][1])
            return true;
    }
    return false;
}
function generateMap(nodesArray){
    var map = {};

    for(var x = 0; x < nodesArray.length; x++)
    {
        var thisPoint = nodesArray[x];
        var thisPointX = thisPoint[0];
        var thisPointY = thisPoint[1];
        var addDict = {};
        var reachableNodesArray = [
            [thisPointX, thisPointY-10], //North
            [thisPointX+10, thisPointY-10], //Northeast
            [thisPointX+10, thisPointY], //East
            [thisPointX+10, thisPointY+10], //Southeast
            [thisPointX, thisPointY+10], //South
            [thisPointX-10, thisPointY+10], //Southwest
            [thisPointX-10, thisPointY],//West
            [thisPointX-10, thisPointY-10]//Northwest
        ];
        for(var i = 0; i < reachableNodesArray.length; i++)
        {
            if(inNodesArray(nodesArray,reachableNodesArray[i]))
            {
                addDict[reachableNodesArray[i]]=1;
            }
        }
        map[thisPoint] = addDict;
    }
    return map;


}

function calculateDistanceToGoal(key, endPoint) {
    var x = Math.abs(key[0] - endPoint[0]);
    var y = Math.abs(key[1] - endPoint[1]);
    return Math.sqrt(x*x + y*y);
}
function generatePath(startCoordinates,nearestStartPoint,endPoint,map) {
    var pathToFinish = [startCoordinates,nearestStartPoint];
    var finishedBool = false;
    var thisPoint = nearestStartPoint;
    while(!finishedBool){

        var nearestPointsDistance = [];
        var nearestPoints = map[thisPoint];

        for (var key in nearestPoints)
        {
            key = key.split(",");
            key[0] = parseInt(key[0]);
            key[1] = parseInt(key[1]);
            nearestPointsDistance.push([key,calculateDistanceToGoal(key, endPoint)]);
        }

        nearestPointsDistance.sort(function(a, b) {
            return a[1] - b[1];
        });
        pathToFinish.push(nearestPointsDistance[0][0]);
        thisPoint = nearestPointsDistance[0][0];
        if (thisPoint[0] == endPoint[0] && thisPoint[1] == endPoint[1])
            finishedBool = true;
    }
    return pathToFinish;
}

function drawLine(pathToFinish) {
    var graphics = game.add.graphics(0,0);
    graphics.moveTo(pathToFinish[0][0],pathToFinish[0][1]);
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(1, 0xffd900, 1);
    for (var x = 1; x < pathToFinish.length; x++)
    {
        graphics.lineTo(pathToFinish[x][0],pathToFinish[x][1])
    }

}

//CALCULATES PATH BETWEEN POINTS
function calculatePath(){
    if (start !== null && finish !== null)
    {
        var startCoordinates = [start.x,start.y];
        var finishCoordinates = [finish.x,finish.y];
        var nearestStartArrayCoordinates = [Math.round(startCoordinates[0]/10)*10,Math.round(startCoordinates[1]/10)*10];
        var nearestFinishArrayCoordinates = [Math.round(finishCoordinates[0]/10)*10,Math.round(finishCoordinates[1]/10)*10];
        var nodesArray = generateNodeArray();
        var map = generateMap(nodesArray);
        var pathToFinish = generatePath(startCoordinates,nearestStartArrayCoordinates,nearestFinishArrayCoordinates,map);
        pathToFinish.push(finishCoordinates);
        //drawLine(pathToFinish);



    }
}