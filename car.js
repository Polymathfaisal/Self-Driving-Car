class Car{
    constructor(x, y, width, height, controlType){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.polygon = [];
        this.useAI = controlType == "AI";

        this.speed = 0;
        this.acceleration = 0.3;
        this.rotation = 0.03
        this.maxSpeed = 3;
        this.friction = 0.05; // af = mu*g, Here friction is reverse accelarion due to frictional force;
        this.angle = 0;
        this.damaged = false;
        this.sensor = new Sensor(this);
        this.controls = new Controls(this.useAI);
        this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        this.img = new Image();
        this.img.src = "image//Rcar.png";
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
            this.sensor.update(roadBorders, traffic);
            const offSets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offSets, this.brain);
            if(this.useAI) this.controls.addAIListensers(outputs);
            return false;
            /////////////console.log(outputs);//////////////////
        }
        else return true;
    }

    #assessDamage(roadBorders, traffic){
        ////////// Handle collision with borders //////////////
        for(let i=0; i < roadBorders.length; ++i){
            if(polygonIntesect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        //////////// Handle collision with traffic //////////////
        for(let i=0; i < traffic.length; ++i){
            if(polygonIntesect(this.polygon, traffic[i].points)){
                return true;
            }
        }

        return false;
    }

    //////////// Store all the vertex of Car /////////////////////
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width,this.height)/2;
        var alpha = Math.atan2(this.width,this.height);
        for(let i=0; i < 4; ++i){
            points.push({
                x : this.x - Math.sin(this.angle - alpha + (Math.PI)*(i > 1))*rad,
                y : this.y - Math.cos(this.angle - alpha + (Math.PI)*(i > 1))*rad
            });
            alpha = -alpha;
        }
        return points;
    }

    /////////////// Normal physics of car game //////////////////
    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration; // v = u + at where t = 1;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration; // v = u - at ;
        }
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0){  // Friction working in reverse direction;
            this.speed -= this.friction;
        }
        if(this.speed < 0){ // Friction working in forward direction;
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }
        this.y -= Math.cos(this.angle)*this.speed; // 

        ///////// Handle how much car rotates ///////////////
        if(this.speed != 0 ){
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controls.left){
                this.angle += this.rotation*flip;
            }
            if(this.controls.right){
                this.angle -= this.rotation*flip;
            }
        }
        this.x -= Math.sin(this.angle)*this.speed;
    }


    draw(contex, color, drawSensor = false ){
        /*------ If are not willing to use image of Car.....
        let i = 0;
        if(this.damaged) contex.fillStyle = "gray";
        else contex.fillStyle = color;
        contex.beginPath();
        this.polygon.forEach(vertex =>{
            if(i === 0) contex.moveTo(vertex.x, vertex.y);
            else contex.lineTo(vertex.x, vertex.y);
            ++i;
        });
        contex.fill();
        ---------------------------------------*/

        contex.save();
        contex.translate(this.x, this.y);
        contex.rotate(-this.angle);

        contex.drawImage(
            this.img,
            - this.width/2,
            - this.height/2,
            this.width,
            this.height
        );
        contex.restore(); 
        if(drawSensor) this.sensor.draw(contex);
    }
}

