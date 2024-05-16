const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;
const contex = canvas.getContext("2d");

const road = new Road(canvas.width/2, canvas.width*0.90);
const traffic = [
    new dummyCar(road.getLaneCenter(1), -100,30,60),
    new dummyCar(road.getLaneCenter(0), -300,30,60),
    new dummyCar(road.getLaneCenter(2), -300,30,60)
];

const cars = generateCar(100);
let bestCar = cars[0];
///////// Access the bestFit weights and biases from local storage...
if(localStorage.getItem("bestBrain")){
    for(let i=0; i < cars.length; ++i){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if(i) NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
}
/////////console.log(cars.length);//////////

function generateCar(N){
    const cars = [];
    for(let i=0; i < N; ++i){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 60, "AI"));
    }
    return cars;
}
function save(){
    localStorage.setItem(
        "bestBrain", JSON.stringify(bestCar.brain)
    )
}
function discard(){
    localStorage.removeItem("bestBrain");
}
var pause = false;
function _pause(){
    pause = true;
}
function _continue(){
    pause = false;
    requestAnimationFrame(animate);
}

let distance = 0;
animate();
function animate(time){
    if(pause) return;
    canvas.height = window.innerHeight;

    //////// Update Car and traffic possition /////////////
    for(let i=0; i < cars.length; ++i){
        if(cars[i].update(road.borders, traffic));// _pause();
    }
    for(let i=0; i < traffic.length; ++i){
        traffic[i].update();
    }
    /////////// Finding the Best Car //////////////
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    )

    contex.save();
    contex.translate(0, -bestCar.y + canvas.height*0.7);

    ////////// Draw Traffic and Car ///////////////
    road.draw(contex);
    for(let i=0; i < traffic.length; ++i){
        traffic[i].draw(contex);
    }
    contex.globalAlpha = 0.3;
    for(let i=0; i < cars.length; ++i){
        cars[i].draw(contex, "blue", false);
    }
    contex.globalAlpha = 1;
    bestCar.draw(contex,"blue", true);

    distance += bestCar.speed;
    if(600 <= distance ){
        distance = 0;
        if(traffic.length > 9) traffic.shift();
        traffic.push(
            new dummyCar(road.getLaneCenter(Math.floor(Math.random(time)*3)), bestCar.y - 600,30,60)
        );
    }
    contex.restore();
    requestAnimationFrame(animate);
}


