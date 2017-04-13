//-----------------------------------------------------------------------------
//Global Variables
//-----------------------------------------------------------------------------

var DEBUG_MODE = true;
var DEBUG_ROTATION = 0;

//-----------------------------------------------------------------------------

//light source handling
var lightSources; //group containing light sprites
var robotDict = {}; //KEY IS NAME, VALUE IS OBJECT WHICH EXTENDS SPRITE

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
//Braitenberg Vehicle Class
//-----------------------------------------------------------------------------


//WORKS LIKE A CLASS ODDLY ENOUGH
BraitenbergRobot = function(K_matrix, initialLocationArray, initialOrientation){

    //THE ANCHOR IS SET TO 0,0 BY DEFAULT WHICH IS THE TOP LEFT OF AN IMAGE
    //WE WILL MAKE ALL MEASUREMENTS FROM THERE
    //SENSORL
    
    Phaser.Sprite.call(this, game, initialLocationArray[0], initialLocationArray[1], 'robot'); //extends Sprite
    game.physics.enable(this,Phaser.Physics.ARCADE);

    //SET THE K_MATRIX
    this.K_matrix = K_matrix;
    //THIS WILL ATTACH A ROBOT USING THE TOP LEFT OF THE IMAGE
    this.x = initialLocationArray[0];
    this.y = initialLocationArray[1];
    
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.angularVelocity = 0;
   // this.body.angularVelocity= 0;
   // this.body.velocity = 50;

    //LOCATION OF SENSORS
    this.L_SensorLocationX = this.x+23;
    this.L_SensorLocationY = this.y+7;
    this.R_SensorLocationX = this.x+58;
    this.R_SensorLocationY = this.y+6;

    //ROTATION DATA
    //ANGLE IS INHERITED FROM SPRITE AND IS WHAT ROTATES THE SPRITE
    this.angle = initialOrientation;//degrees
    this.rotateSpeed = 1;

    //intensity of sensors
    this.L_SensorIntensity = 0;
    this.R_SensorIntensity = 0;

    //wheel info
    this.wheelSize = [70,70]; // WE GET TO SET OUR OWN WHEEL SIZE WHICH BASED ON IMAGE IS 70 PX
    this.w1Speed = 0; //left wheel
    this.w2Speed = 0;
};

//MAKES THE ROBOT BECOME AN OBJECT
BraitenbergRobot.prototype = Object.create(Phaser.Sprite.prototype);
BraitenbergRobot.prototype.constructor = BraitenbergRobot;
BraitenbergRobot.prototype.update = function() {

    //CALCULATE NEW XY POSITION BASED ON VELOCITY OF THE WHEELS
    function calculateNewXYAndAngle(velocityLeftWheel, velocityRightWheel) {
        var wheelVelocityDifference = 0;
        if(velocityLeftWheel == velocityRightWheel)
            wheelVelocityDifference = velocityLeftWheel;
        else
            wheelVelocityDifference = math.abs(velocityLeftWheel - velocityRightWheel);


        var newAngle = (velocityRightWheel-velocityLeftWheel)/80;

        return [wheelVelocityDifference,newAngle];
    }
    //  Automatically called by World.update
    //ALWAYS MOVE THE ROBOT
    //moves robot according to where each lightPos is

    function moveRobot(lightPosAr,thisRobot){
        var tempL_SensorIntensity = 0;
        //for each lightPos in array, sensor 1
        var i;
        for(i = 0; i < lightPosAr.children.length; i++){
            tempL_SensorIntensity += calcIntensity(lightPosAr.children[i].x, lightPosAr.children[i].y, thisRobot.L_SensorLocationX, thisRobot.L_SensorLocationY);
        }

        if(tempL_SensorIntensity > 100)
            tempL_SensorIntensity = 100;

        thisRobot.L_SensorIntensity = tempL_SensorIntensity;

        //for each lightPos in array, sensor 2
        var tempR_SensorIntensity  = 0;
        for(i = 0; i < lightPosAr.children.length; i++){
            tempR_SensorIntensity+= calcIntensity(lightPosAr.children[i].x, lightPosAr.children[i].y, thisRobot.R_SensorLocationX, thisRobot.R_SensorLocationY);
        }


        if(tempR_SensorIntensity > 100)
            tempR_SensorIntensity = 100;

        thisRobot.R_SensorIntensity = tempR_SensorIntensity;

        //calculate wheel speed
        calcWheelSpeed(thisRobot);

        var SPEED_NERF = 0.01;

        //based on wheel speeds, move the robot
        //first find linear velocity (px/s) of each wheel
        var velocityLeftWheel = thisRobot.w1Speed*35*SPEED_NERF; //radius of wheel sprite
        var velocityRightWheel = thisRobot.w2Speed*35*SPEED_NERF;

        //THEN USING THAT SPEED FIND OUT HOW FAR A ROBOT WOULD GO PER SECOND
        //AND CHANGE THE X AND Y POS ACCORDINGLY
        var newVelocityandAngle = calculateNewXYAndAngle(velocityLeftWheel,velocityRightWheel);
        thisRobot.body.angularVelocity = newVelocityandAngle[1];
        game.physics.arcade.velocityFromAngle(thisRobot.angle, newVelocityandAngle[0], thisRobot.body.velocity);
        //thisRobot.body.velocity = newVelocityandAngle[0];
        //console.log("Velocity" + thisRobot.velocity);
        //thisRobot.body.angularVelocity = (-newVelocityandAngle[1]);
        //console.log("Angle: " + thisRobot.angle);


        //UPDATE THE LOCATION OF THE SENSORS WITH RESPECT TO THE ROTATION POINT.
        updateSensorLocation(thisRobot);
    }

    function degreesToRads(degrees){
        return (degrees*math.PI)/180;
    }
    function radsToDegrees(radians){
        return radians*180/math.PI;
    }

    //I USED THE ROTATION FORMULA FOR THIS VALUE. THE SIGNS MAY NEED TO BE FLIPPED
    function updateSensorLocation(thisRobot){
        // ORIGINAL POSITION IT WOULD BE IF THE ANGLE WAS 0
        var L_SensorDefaultLocationX =  23;
        var L_SensorDefaultLocationY = 6;
        var R_SensorDefaultLocationX = 58;
        var R_SensorDefaultLocationY = 6;


        //SET THE NEW LOCATION BASED ON CURRENT POSITION AND ROTATION
        thisRobot.L_SensorLocationX = thisRobot.x + Math.round(L_SensorDefaultLocationX*math.cos(degreesToRads(thisRobot.angle))-L_SensorDefaultLocationY*math.sin(degreesToRads(thisRobot.angle)));
        thisRobot.L_SensorLocationY = thisRobot.y+ Math.round(L_SensorDefaultLocationX*math.sin(degreesToRads(thisRobot.angle))+L_SensorDefaultLocationY*math.cos(degreesToRads(thisRobot.angle)));
        thisRobot.R_SensorLocationX = thisRobot.x+ Math.round(R_SensorDefaultLocationX*math.cos(degreesToRads(thisRobot.angle))-R_SensorDefaultLocationY*math.sin(degreesToRads(thisRobot.angle)));
        thisRobot.R_SensorLocationY = thisRobot.y+ Math.round(R_SensorDefaultLocationX*math.sin(degreesToRads(thisRobot.angle))+R_SensorDefaultLocationY*math.cos(degreesToRads(thisRobot.angle)));
        var velocityLeftWheel = thisRobot.w1Speed*35; //radius of wheel sprite
        var velocityRightWheel = thisRobot.w2Speed*35;

        // Width of the robot
        var axel = 80;

        var robot_angle = (velocityRightWheel - velocityLeftWheel) / axel;

        //console.log('Angle of Robot: ' + robot_angle);

        thisRobot.rotation = thisRobot.rotation + robot_angle;// - 90;

        var wheel_average = ( velocityLeftWheel + velocityRightWheel ) / 2;

        thisRobot.x = thisRobot.x + math.cos(robot_angle) * wheel_average;
        thisRobot.y = thisRobot.y + math.sin(robot_angle) * wheel_average;

    }

    //based on light position, own sensor position will give intensity of light
    function calcIntensity(lightPosX, lightPosY, sensorX, sensorY){
        //calculate distance d btwn lightPos and sensor
        var X = math.abs(lightPosX - sensorX);
        var Y = math.abs(lightPosY - sensorY);
        var distance = math.sqrt(X*X + Y*Y);
        if(distance < 1)
            distance = 1;
        return Math.round(100/distance);
    }

    //Based on sensor output and matrix K, determine speed of the wheels
    function calcWheelSpeed(thisRobot){
        //Each wheel speed is the dot product of its corresponding row of K and the array of the two sensors

        thisRobot.w1Speed = math.dot([thisRobot.K_matrix[0][0], thisRobot.K_matrix[0][1]], [thisRobot.L_SensorIntensity, thisRobot.R_SensorIntensity]);
        thisRobot.w2Speed = math.dot([thisRobot.K_matrix[1][0], thisRobot.K_matrix[1][1]], [thisRobot.L_SensorIntensity, thisRobot.R_SensorIntensity]);

    }
    moveRobot(lightSources,this);
};

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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //ADDING BUTTONS
    addLightSourceButton = game.add.button(game.width - 100,10,'addLight',addLightSourceButtonListener,this,0,0,1,0);
    addRobotButton= game.add.button(game.width - 100,70,'addRobot',addRobotButtonListener,this,0,0,1,0);
    removeRobotButton= game.add.button(game.width - 100,130,'removeRobot',removeRobotButtonListener,this,0,0,1,0);

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
}

function addLightSource(game){
    //spawn light source at click location, and add to array
    lightSources.add(game.add.sprite(game.input.x, game.input.y, 'sun'));
}

//NEED TO CHECK FOR VALID INPUT FROM PROMPTS
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
    var i;
    for(i = 0; i < tempArray.length; i++)
    {
        tempArray[i] = parseFloat(tempArray[i]);
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
    var i;
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

    accurateAddRobotInformationBool = true;

    //USER PROMPTS TO GET INFORMATION FROM USER
    //KMATRIX

    if(DEBUG_MODE){
        robotName = 'Robby';
        K_matrix = [ [0.1,0], [0,0.1] ];
        locationArray = [500,500];
    } else{

         var KmapString = prompt("Enter K Map"); //k11,k12,k21,k22 <- this format
        //PARSE THAT STRING
        var K_matrix = parseKmapString(KmapString);
        //IF THEY DID IT RIGHT
        if(accurateAddRobotInformationBool) {
            //GET LOCATION
            var newRobotLocation = prompt("Enter Desired Location (x,y)"); //x,y <- this format
            var locationArray = parseNewRobotLocation(newRobotLocation);
        }
        else{
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
    }

    //CREATE A NEW VEHICLE AND ADD IT TO THE DICTIONARY TO KEEP TRACK OF THEM BY NAME
    robotDict[robotName] = new BraitenbergRobot(K_matrix,locationArray,180);
    game.add.existing(robotDict[robotName]);

}

function removeRobotButtonListener(){
    //JUST SET THE LIGHT TOGGLE TO TRUE AND OTHERS FALSE
    addLightSourceBool = false;

    var removeRobotName = prompt("Enter Robot Name");
    if(removeRobotName in robotDict)
    {
        robotDict[removeRobotName].destroy();
    }

}