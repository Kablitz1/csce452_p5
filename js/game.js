
//-----------------------------------------------------------------------------
//Global Variables
//-----------------------------------------------------------------------------

//light source handling
var lightToggle = true; //says whether clicking will place a light source
var lightSources; //group containing light sprites

//-----------------------------------------------------------------------------
//Class Definitions
//-----------------------------------------------------------------------------
//Braitenburg Vehicle Class
//-----------------------------------------------------------------------------
class BVehicle{
    constructor(matK, initPosX, initPosY, initOrient, wheelSize){
        //body info
        this.matK = matK; //2x2 mat
        this.PosX = initPosX; //int
        this.PosY = initPosY; //int
        this.orient = initOrient;//degrees
        
        //position of sensors
        //this.sens1X = //NOTE:: we have to initialize this
        //this.sens1Y = //NOTE:: we have to initialize this

        //intensity of sensors
        this.sens1S = 0;
        this.sens2S = 0;
        
        //wheel info
        this.wheelSize = wheelSize;
        this.w1Speed = 0; //left wheel
        this.w2Speed = 1;
    }
    
    //moves robot according to where each lightPos is
    moveRobot(lightPosAr){
        //for each lightPos in array, sensor 1
        var sOut1 = 0;
        for(i = 0; i < lightPosAr.length; i++){
            calcIntensity(sOut1, lightPosAr[i].PosX, lightPosAr[i].PosY, this.sens1X, this.sens1Y);
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
        sOut += 100/d;
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
}

//Create
//-----------------------------------------------------------------------------
//create initial assets for game
function create() {
    
    lightSources = game.add.group();
    lightSources.setAll('checkWorldBounds', true);
    lightSources.setAll('outOfBoundsKill', true);
    
    
    
    //prompt example...
    /*
    var name = prompt("Please enter your name", "Anonymous");
    if(name) {    
        console.log("Hello "+name+", nice to meet you!");
    }*/
}

//Update
//-----------------------------------------------------------------------------
//main update loop

//delay factor
var frameDelay = 0;
function update() {
    frameDelay++;
    if(frameDelay > 6){
        if(lightToggle){
            if(game.input.activePointer.isDown){
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