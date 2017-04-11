//-----------------------------------------------------------------------------
//Global Variables
//-----------------------------------------------------------------------------

//light source handling
var lightSources; //group containing light sprites
var robotImageArray;
var robotDict = {};

//BUTTON BUTTONS
var addLightSourceButton;
var addRobotButton;
var removeRobotButton;

//BOOL BUTTONS
var addLightSourceBool; //says whether clicking will place a light source
var addRobotBool;
var removeRobotBool;

//-----------------------------------------------------------------------------
//Class Definitions
//-----------------------------------------------------------------------------
//Braitenburg Vehicle Class
//-----------------------------------------------------------------------------

BraitenbergRobot = function(K_matrix, initialLocationArray, initialOrientation){
    Phaser.Sprite.call(this, game, initialLocationArray[0], initialLocationArray[1], 'robot'); //extends Sprite

};

BraitenbergRobot.prototype = Object.create(Phaser.Sprite.prototype);
BraitenbergRobot.prototype.constructor = BraitenbergRobot;

class BVehicle{
    constructor(matK, initialLocationArray, initOrient){
        //body info
        this.matK = matK; //2x2 mat
        this.PosX = initialLocationArray[0]; //int
        this.PosY = initialLocationArray[1]; //int
        this.orient = initOrient;//degrees

        //position of sensors
        //this.sens1X = //NOTE:: we have to initialize this
        //this.sens1Y = //NOTE:: we have to initialize this

        //intensity of sensors
        this.sens1S = 0;
        this.sens2S = 0;

        //wheel info
        this.wheelSize = [20,20]; // WE GET TO SET OUR OWN WHEEL SIZE
        this.w1Speed = 0; //left wheel
        this.w2Speed = 1;
    }

    //moves robot according to where each lightPos is
    moveRobot(lightPosAr){
        //for each lightPos in array, sensor 1
        var sOut1 = 0;
        for(i = 0; i < lightPosAr.length; i++){
            this.calcIntensity(sOut1, lightPosAr[i].PosX, lightPosAr[i].PosY, this.sens1X, this.sens1Y);
        }

        this.sens2S = sOut2;

        //for each lightPos in array, sensor 2
        var sOut2 = 0;
        for(i = 0; i < lightPosAr.length; i++){
            calcIntensity(sOut2, lightPosAr[i].PosX, lightPosAr[i].PosY, this.sens2X, this.sens2Y);
        }
        this.sens2S = sOut2;

        //calculate wheel speed
        calcWheelSpeed();

        //based on wheel speeds, move the robot
        //first find linear velocity (px/s) of each wheel
        var vLeft = this.w1Speed*45; //radius of wheel sprite
        var vRight = this.w2Speed*45;

        //then use equations to find the velocity and rotation of middle point.
        //NOTE:: fill in!

    }

    //based on light position, own sensor position will give intensity of light
    calcIntensity(sOut, lightPosX, lightPosY, sensorX, sensorY){
        //calculate distance d btwn lightPos and sensor
        var X = math.abs(lightPosX - sensorX);
        var Y = math.abs(lightPosY - sensorY);
        var distance = math.sqrt(X*X + Y*Y);
        if(distance < 1)
            distance = 1;
        return Math.round(100/distance);
    }

    //Based on sensor output and matrix K, determine speed of the wheels
    calcWheelSpeed(){
        //Each wheel speed is the dot product of its corresponding row of K and the array of the two sensors
        this.w1Speed = math.dot([this.matK.get(0,0), this.matK.get(0,1)], [this.sens1S, this.sens2S]);
        this.w2Speed = math.dot([this.matK.get(1,0), this.matK.get(1,1)], [this.sens1S, this.sens2S]);
    }

}

function addLightSource(game){
    //spawn light source at click location, and add to array
    lightSources.add(game.add.sprite(game.input.x, game.input.y, 'sun'));
}

function addRobot(game){

}

function removeRobot(game){

}
//-----------------------------------------------------------------------------
//Phaser Game Functionality
//-----------------------------------------------------------------------------

//mapping phaser game to var
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

//Preload
//-----------------------------------------------------------------------------
//preload assets needed for game
function preload() {
    game.load.image('sun', 'assets/sun.png');
    game.load.image('robot','assets/vehicle.png');
    game.load.spritesheet('addLight', 'assets/addLightSource.png',75,50);
    game.load.spritesheet('addRobot', 'assets/addRobot.png',75,50);
    game.load.spritesheet('removeRobot', 'assets/removeRobot.png',75,50);

}

//Create
//-----------------------------------------------------------------------------
//create initial assets for game
function create() {

    //SET BACKGROUND COLOR
    game.stage.backgroundColor = "#36b3de"; // VERY RELAXING :)

    var robot = new BraitenbergRobot(0,[100,100],0);
    game.add.existing(robot);
    //ADDING BUTTONS
    addLightSourceButton = game.add.button(game.width - 100,10,'addLight',addLightSourceButtonListener,this,0,0,1,0);
    addRobotButton= game.add.button(game.width - 100,70,'addRobot',addRobotButtonListener,this,0,0,1,0);
    removeRobotButton= game.add.button(game.width - 100,130,'removeRobot',removeRobotButtonListener,this,0,0,1,0);

    //CREATING ROBOT GROUP
    robotImageArray = game.add.group();
    robotImageArray.setAll('checkWorldBounds', true);
    robotImageArray.setAll('outOfBoundsKill', true); //WE MAY WANT TO REMOVE THIS

    //CREATING LIGHT SOURCES GROUP
    lightSources = game.add.group();
    lightSources.setAll('checkWorldBounds', true);
    lightSources.setAll('outOfBoundsKill', true);
}

//Update
//-----------------------------------------------------------------------------
//main update loop

//delay factor
var frameDelay = 0;
function update() {
    frameDelay++;
    if(frameDelay > 6){
        //I LIMITED THE RANGE YOU CAN ADD SOMETHING.
        if(addLightSourceBool){
            if(game.input.activePointer.isDown && game.input.mousePointer.x < 1175){
                addLightSource(game);
                console.log("Num Lights: "+lightSources.length);
            }
        }
        else if(addRobotBool) {
            if (game.input.activePointer.isDown && game.input.mousePointer.x < 1175) {
                addRobot(game);
                console.log("Num Robots: " + robotImageArray.length);
            }
        }
        else if(removeRobotBool) {
            if (game.input.activePointer.isDown && game.input.mousePointer.x < 1175) {
                removeRobot(game);
                console.log("Num Robots: " + robotImageArray.length);
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
//Button Functions 
//-----------------------------------------------------------------------------
function addLightSourceButtonListener(){
    //JUST SET THE LIGHT TOGGLE TO TRUE AND OTHERS FALSE
    addLightSourceBool = true;
    addRobotBool = false;
    removeRobotBool = false;
}

//NEED TO CHECK FOR VALID INPUT FROM PROMTS
var accurateAddRobotInformationBool;

//SIMPLE FUNCTION FOR PARSING STRING
function parseKmapString(KmapString) {
    //SPLIT STRING BY COMMA
    var tempArray = KmapString.split(',');
    //ERROR CHECKING
    if (tempArray.length != 4)
    {
        accurateAddRobotInformationBool = false;
        return 0;
    }
    //TURN FROM STRING TO INT
    for(i = 0; i < tempArray.length; i++)
    {
        tempArray[i] = parseInt(tempArray[i]);
    }

    //GET INTO 2X2 ARRAY AND RETURN
    return [[tempArray[0],tempArray[1]],[tempArray[2],tempArray[3]]];
}
//PARSING STRING OF LOCATION
function parseNewRobotLocation(newRobotLocation) {
    //SPLIT STRING
    var array = newRobotLocation.split(',');
    //SIMPLE ERROR CHECKING
    if (array.length != 2)
    {
        accurateAddRobotInformationBool = false;
        return 0;
    }
    //TURN STRING TO INT
    for(i = 0; i < array.length; i++)
    {
        array[i] = parseInt(array[i]);
    }
    return array;
}

//WHAT TO DO WHEN WE CLICK ON ADD ROBOT BUTTON
function addRobotButtonListener(){
    //JUST SET THE LIGHT TOGGLE TO TRUE AND OTHERS FALSE
    addLightSourceBool = false;
    addRobotBool = true;
    removeRobotBool = false;
    accurateAddRobotInformationBool = true;

    //USER PROMPTS TO GET INFORMATION FROM USER
    //KMATRIX
    var KmapString = prompt("Enter K Map"); //k11,k12,k21,k22 <- this format
    //PARSE THAT STRING
    var K_matrix = parseKmapString(KmapString);
    //IF THEY DID IT RIGHT
    if(accurateAddRobotInformationBool) {
        //GET LOCATION
        var newRobotLocation = prompt("Enter Desired Location (x,y)"); //x,y <- this format
        var locationArray = parseNewRobotLocation(newRobotLocation);
    }
    else
    {
        //tell the user it got it wrong
        window.alert("Bad Information!");
        accurateAddRobotInformationBool = true;
        return 0;
    }
    //IF THEY GET THAT RIGHT TOO
    if(accurateAddRobotInformationBool)
        //GET THE NAME
        var robotName = prompt("Enter Robot Name"); //FOR REMOVING
    else{
        //tell the user it got it wrong
        window.alert("Bad Information!");
        accurateAddRobotInformationBool = true;
        return 0;
    }

    //CREATE A NEW VEHICLE AND ADD IT TO THE DICTIONARY TO KEEP TRACK OF THEM BY NAME
    robotDict[robotName] = new BVehicle(K_matrix,locationArray,0)

}
function removeRobotButtonListener(){
    //JUST SET THE LIGHT TOGGLE TO TRUE AND OTHERS FALSE
    addLightSourceBool = false;
    addRobotBool = false;
    removeRobotBool = true;
    var removeRobotName = promt("Enter Robot Name");

}