console.log('loaded!');

// Variables
const STARTING_TIME = 30;
var gameOver = false;
var remainingTime = 0;
var delayHandle = null;
var timerHandle = null;

//holds randomly selected wires that must be cut to win:
var wiresToCut = [];
//object to hold the wired that's been already cut:
var wiresCut = {
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
}

// DOM References
var timerText;
var startButton;
var resetButton;
var blue;
var green;
var red;
var white;
var yellow;
var wireBox;

// Eventt Listeners
document.addEventListener("DOMContentLoaded", function(e) {
  //console.log('LOADED!')
  timerText = document.getElementById("timertext");
  startButton = document.getElementById("start");
  resetButton = document.getElementById("reset");
  blue = document.getElementById("blue");
  green = document.getElementById("green");
  red = document.getElementById("red");
  white = document.getElementById("white");
  yellow = document.getElementById("yellow");
  wireBox = document.getElementById("wirebox");

  initGame();

  // Click handlers
  startButton.addEventListener("click", function(e) {
    console.log("clicked start");
    timerHandle = setInterval(updateClock, 1000);
  });
  resetButton.addEventListener("click", function(e) {
    console.log("clicked reset");
    reset();
  });
  
  //because we have 5 wires, 
  //instead of typing out 5 identical event handler functions,
  //ie blue.addEventListener("click", function(e) {}); etc.
  //use event propagation property & set event listener
  //on the container containing wires, ie wireBox:
  wireBox.addEventListener("click", function(e) {
    //want to see if wire's been cut:
    //if it's not in the wiresCut array and game isn't over
    if (!wiresCut[e.target.id] && !gameOver) {
      //update the image:
      e.target.src = "img/cut-" + e.target.id + "-wire.png";
      //mark it as cut
      wiresCut[e.target.id] = true;
      //was it a correct wire? test to see if it's -1
      var wireIndex = wiresToCut.indexOf(e.target.id)
      if (wireIndex > -1) {
        //correct
        console.log(e.target.id + " was correct");
        //take out the wire out of wires to cut object
        wiresToCut.splice(wireIndex, 1);
        //check for win will go here:
        if (checkForWin()) {
          endGame(true);
        }
      } else {
        //incorrect
        console.log(e.target.id + " was incorrect");
        //start the 750ms delay
        delayHandle = setTimeout(function() {
          //end the game with a LOSS function
          console.log("Bang!");
          endGame(false);
        }, 750);
      }
    } 
      
    
    /*
    //disable ability to click on wire box b/c only want the wires
    //switch statement:
    switch(e.target.id) {
      case "blue":
        
        
        break;
      case "green":
        
        break;
      case "red":
        
        break;
      case "white":
        
        break;
      case "yellow":
        
        break;
      default:
        break;
    }
    */

  })
})

//Functions:
function checkForWin() {
  return wiresToCut.length ? false : true;
}

function endGame(win) {
  //if game ends, clear the timers
  clearTimeout(delayHandle);
  clearInterval(timerHandle);
  //change game state to over:
  gameOver = true;
  //enable reset button
  resetButton.disabled = false;
  if (win) {
    //win condition
    console.log("You saved the city!");
    //change timer colors
    timerText.classList.remove("red");
    timerText.classList.add("green");
  } else {
    //loss condition
    console.log("BOOM!");
    //change background pic
    document.body.classList.remove("unexploaded");
    document.body.classList.add("exploaded");
  }
}

function updateClock() {
  remainingTime--;
  if (remainingTime <= 0) {
    endGame(false);
  }
  timerText.textContent = "0:00" + remainingTime;
}

function initGame() {
  wiresToCut.length = 0; //empty out the array from a previous game
  remainingTime = STARTING_TIME;
  timerText.textContent = "0:00" + remainingTime;
  for (let wire in wiresCut) { //randomizes wires
    var rand = Math.random();
    if (rand > 0.5) {
      wiresToCut.push(wire);
    }
  }
  console.log(wiresToCut);
  resetButton.disabled = true;
  startButton.disabled = false;
}

function reset() {
  gameOver = false;
  var wireImages = wireBox.children; //picks up every element in the wire box
  for (let i = 0; i < wireImages.length; i++) { // replace wire images to uncut
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
    
  }
  document.body.classList.add("unexploaded");
  document.body.classList.remove("exploaded"); //replace images
  timerText.classList.remove("green"); //change timer colors
  timerText.classList.add("red");
  clearTimeout(delayHandle);
  clearInterval(timerHandle);
  for (let wire in wiresCut) {
    wiresCut[wire] = false;
  }
  initGame();
}
