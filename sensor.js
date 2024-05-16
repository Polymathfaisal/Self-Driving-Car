class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 6;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic){
        this.#castRays();
        /////////// Store all nearest obstacle to sensor ////////////
        this.readings = [];
        for(let i=0; i < this.rays.length; ++i){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    #getReading(ray, roadBorders, traffic){
        let touches = [];
        ///////////// Sensor sence the borders ///////////////
        for(let i=0; i < roadBorders.length; ++i){
            const touch = getIntersection(
                ray[0], ray[1],
                roadBorders[i][0], roadBorders[i][1]
            );

            if(touch) touches.push(touch);
        }
        //////// Sensor sence the traffic ////////////////////
        for(let i=0; i < traffic.length; i++){
            const poly = traffic[i].points;
            for(let j=0; j < poly.length; j++){
                const value = getIntersection(
                    ray[0], ray[1],
                    poly[j], poly[(j+1)%4]
                );
                if(value) touches.push(value);
            }
        }
        ///////// Rteurn nearest object of sensor ////////////
        if(touches.length == 0) return null;
        else{
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays(){
        this.rays = [];
        //////// Strore all the rays of sensor /////////////
        for(let i=0; i < this.rayCount; ++i){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                (this.rayCount == 1) ? 0.5 : i/(this.rayCount - 1)
            ) + this.car.angle;

            const start = {x : this.car.x, y : this.car.y};
            const end = {
                x : this.car.x - this.rayLength*Math.sin(rayAngle),
                y : this.car.y - this.rayLength*Math.cos(rayAngle)
            };
            this.rays.push([start, end]);
        }
    }

    
    draw(contex){
        let i = 0;
        this.rays.forEach(ray => {
            let end = ray[1];
            if(this.readings[i]) {
                end = this.readings[i];
                contex.beginPath();
                contex.lineWidth = 2;
                contex.strokeStyle = "black";
                contex.moveTo(ray[1].x, ray[1].y);
                contex.lineTo(end.x, end.y);
                contex.stroke();
            }

            contex.beginPath();
            contex.lineWidth = 2;
            contex.strokeStyle = "yellow";
            contex.moveTo(ray[0].x, ray[0].y);
            contex.lineTo(end.x, end.y);
            contex.stroke();
            i++;
        });
    }
}