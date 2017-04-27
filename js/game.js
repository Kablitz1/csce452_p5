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

var linesDrawn = [];

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
//REMOVES THE DRAWN LINES FROM THE PATH FUNCTION
function removeLinesDrawn() {
    for(var x = 0; x < linesDrawn.length; x++)
    {
        linesDrawn[x].destroy();

    }
    linesDrawn = [];
}
function addStartSprite(game){
    if (startCount > 0)
        return null;

    removeLinesDrawn();
    startCount+=1;
    //spawn light source at click location, and add to array
    start = game.add.sprite(game.input.x, game.input.y, 'start');

    start.inputEnabled = true;
    start.input.useHandCursor = true;

    startX = game.input.x;
    startY = game.input.y;

    start.events.onInputDown.add(destroyStartSprite, this);
}

//ADD SPRITE TO GAME
function addFinishSprite(game){
    //WE ONLY WANT ONE
    if (finishCount > 0)
        return null;

    //IF THERE IS A LINE DRAWN REMOVE THOSE LINES
    removeLinesDrawn();
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
    removeLinesDrawn()
    sprite.destroy();
}


function destroyFinishSprite (sprite) {
    finishCount-=1;
    removeLinesDrawn()
    sprite.destroy();
}

//CHECKS TO MAKE SURE THAT THE POSITION DESIRED IS NOT WITHIN THE AREA OF THE SQUARES
function confirmPlacement(mouseX, mouseY){
    var rectangle1Range = calculateRectangle1Area();
    var rectangle2Range = calculateRectangle2Area();
    var rectangle3Range = calculateRectangle3Area();

    //CHECKING FIRST SQUARE
    if ((rectangle1Range[0][0] < mouseX  && mouseX < rectangle1Range[0][1]) && (rectangle1Range[1][0] < mouseY && mouseY < rectangle1Range[1][1]))
        return false;
    //CHECKING SECOND SQUARE
    else if((rectangle2Range[0][0] < mouseX  && mouseX < rectangle2Range[0][1]) && (rectangle2Range[1][0] < mouseY && mouseY < rectangle2Range[1][1]))
        return false;
    // CHECKING THIRD SQUARE
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
    //500X500 SQUARE SO CHECK ALL THE POSSIBLE POINTS ON THE GRID
    for (var x = 0; x < 500; x=x+10)
    {
        for(var y = 0; y < 500; y=y+10)
        {
            //IF THE POINT DOES NOT CONFLICT WITH SQUARE ADD IT.
            if(confirmPlacement(x,y))
            {
                nodesArray.push([x,y]);
            }
        }
    }

    return nodesArray;
}

//CHECK IF THIS POINT IS INSIDE THE NODE ARRAY OTHERWISE WE DON'T NEED IT
function inNodesArray(nodesArray,thisPoint) {

    //IF ONE OF THE VALUES IS NEGATIVE WE DON'T CARE
    if(thisPoint[0] < 0 || thisPoint[1] < 0)
        return false;
    //GO THROUGH THE WHOLE ARRAY EACH TIME. I KNOW IT'S INEFFICIENT
    for(var x = 0; x< nodesArray.length; x++)
    {
        //IF THE POINTS ARE THE SAME IT IS TRUE
        if(thisPoint[0] == nodesArray[x][0] && thisPoint[1] == nodesArray[x][1])
            return true;
    }
    //OTHERWISE WE WENT THROUGH THE WHOLE ARRAY AND DID NOT FIND IT
    return false;
}

//THIS CREATES THE MAP FROM THE NODES ARRAY.
// BASICALLY EVERY POINT IN THE ARRAY HAS AT MOST 8 POINTS AROUND IT CAN GO TO BUT FIRST WE CHECK IF THAT IS A LEGAL MOVE
// THEN WE ADD IT TO A DICTIONARY AND THEN ADD THAT TO A LARGER DICTIONARY MAP
function generateMap(nodesArray){
    //THIS WILL HOLD EVERYTHING
    var map = {};

    //FOR EACH NODE IN THE ARRAY
    for(var x = 0; x < nodesArray.length; x++)
    {
        // SET THE POINT
        var thisPoint = nodesArray[x];
        //GET THE X AND Y
        var thisPointX = thisPoint[0];
        var thisPointY = thisPoint[1];
        // INITIALIZE A NEW DICT
        var addDict = {};
        // THERE ARE 8 POINTS WE CAN POSSIBLY REACH
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
        //FOR EACH OF THOSE POINTS CHECK IF THEY ARE IN THE ARRAY AND IF SO CREATE AN EDGE BY ADDING IT TO THE DICT
        for(var i = 0; i < reachableNodesArray.length; i++)
        {
            if(inNodesArray(nodesArray,reachableNodesArray[i]))
            {
                addDict[reachableNodesArray[i]]=1;
            }
        }
        //ADD THIS POINT'S EDGE LIST TO THE MAP
        map[thisPoint] = addDict;
    }
    return map;


}

//THIS IS MORE OF A GREEDY SEARCH THAN A* SORRY MARK
function calculateDistanceToGoal(key, endPoint) {
    var x = Math.abs(key[0] - endPoint[0]);
    var y = Math.abs(key[1] - endPoint[1]);
    return Math.sqrt(x*x + y*y);
}

// RETURN AN ARRAY THAT CONTAINS THE POINTS ALONG THE PATH
function generatePath(startCoordinates,nearestStartPoint,endPoint,map) {
    // ADD THE FIRST TWO THAT WE KNOW
    var pathToFinish = [startCoordinates,nearestStartPoint];
    var finishedBool = false;
    var thisPoint = nearestStartPoint;
    //WHILE WE ARE NOT AT THE END
    while(!finishedBool){

        // FOR FINDING THE NEXT POINT
        var nearestPointsDistance = [];
        // GET ALL ADJACENT POINTS
        var nearestPoints = map[thisPoint];

        //FOR EACH POINT FIND THE DISTANCE
        for (var key in nearestPoints)
        {
            key = key.split(",");
            key[0] = parseInt(key[0]);
            key[1] = parseInt(key[1]);
            nearestPointsDistance.push([key,calculateDistanceToGoal(key, endPoint)]);
        }

        //SORT FOR THE MIN
        nearestPointsDistance.sort(function(a, b) {
            return a[1] - b[1];
        });
        //PUSH ON THE PATH THE CLOSEST ONE TO THE GOAL
        pathToFinish.push(nearestPointsDistance[0][0]);
        //SET THIS POINT TO CLOSER POINT
        thisPoint = nearestPointsDistance[0][0];

        //IF WE HAVE REACHED THE GOAL THEN QUIT
        if (thisPoint[0] == endPoint[0] && thisPoint[1] == endPoint[1])
            finishedBool = true;
    }
    //AND RETURN THE PATH
    return pathToFinish;
}

//DRAW THE LINE FROM START TO FINISH
function drawLine(pathToFinish) {

    //FOR EACH POINT IN THE PATH
    for (var x = 0; x < pathToFinish.length-1; x++)
    {
        //CREATE A GRAPHICS OBJECT
        var graphics = game.add.graphics(0,0);
        //CONFIGURE LINE
        graphics.moveTo(pathToFinish[x][0],pathToFinish[x][1]);
        graphics.beginFill(0x50c878);
        //CREATE LINE
        graphics.lineStyle(1, 0x50c878, 1);
        //KEEP TRACK OF LINE SO WE CAN REMOVE IT LATER
        var line = graphics.lineTo(pathToFinish[x+1][0],pathToFinish[x+1][1]);
        linesDrawn.push(line)
    }
    //DO IT FOR THE LAST ITEM IN THE LIST
    var graphics = game.add.graphics(0,0);
    graphics.moveTo(pathToFinish[pathToFinish.length-2][0],pathToFinish[pathToFinish.length-2][1]);
    graphics.beginFill(0x50c878);
    graphics.lineStyle(4, 0x50c878, 1);
    var line = graphics.lineTo(pathToFinish[pathToFinish.length-1][0],pathToFinish[pathToFinish.length-1][1])
    linesDrawn.push(line)

}

//CALCULATES PATH BETWEEN POINTS
function calculatePath(){
    //MAKE SURE WE HAVE WHAT WE NEED TO CALCULATE PATH
    if (start !== undefined && finish !== undefined && linesDrawn.length === 0)
    {
        //GET THE START FOR PATH
        var startCoordinates = [start.x,start.y];
        //GET THE END FOR PATH
        var finishCoordinates = [finish.x,finish.y];
        //FOR FINDING THE PATH
        var nearestStartArrayCoordinates = [Math.round(startCoordinates[0]/10)*10,Math.round(startCoordinates[1]/10)*10];
        //FOR FINDING THE PATH WE WILL USE THIS AND PREVIOUS IN THE MAP TO FIND PATH SINCE THEY ARE ALL ROUDED TO NEAREST 10
        var nearestFinishArrayCoordinates = [Math.round(finishCoordinates[0]/10)*10,Math.round(finishCoordinates[1]/10)*10];
        //CREATE POSSIBLE NODES BASED ON SQUARE PLACEMENT
        var nodesArray = generateNodeArray();
        //CREATE MAP BASED ON THAT
        var map = generateMap(nodesArray);
        //GENERATE PATH
        var pathToFinish = generatePath(startCoordinates,nearestStartArrayCoordinates,nearestFinishArrayCoordinates,map);
        //PUSH THE FINAL COORDINATES SO IT IS COMPLETE
        pathToFinish.push(finishCoordinates);
        //DRAW LINES
        drawLine(pathToFinish);



    }
}