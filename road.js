class Road{
    constructor(x, width, laneCount = 3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width/2;
        this.right = x + width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
        /////// Store the vertx of borders ////////////////////
        const topLeft = {x : this.left, y : this.top};
        const topRight = {x : this.right, y : this.top};
        const bottomLeft = {x : this.left, y : this.bottom};
        const bottomRight = {x : this.right, y : this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    draw(contex){
        contex.lineWidth = 5;
        contex.strokeStyle = "white";

        for(let i=1; i < this.laneCount; ++i){
            //////// Linear interpolation function to handle lane spacing///////////
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );

            contex.beginPath();
            contex.setLineDash([20,20]);
            contex.moveTo(x, this.top);
            contex.lineTo(x, this.bottom);
            contex.stroke();
        }

        contex.setLineDash([]);
        this.borders.forEach(border => {
            contex.beginPath();
            contex.moveTo(border[0].x, border[0].y);
            contex.lineTo(border[1].x, border[1].y);
            contex.stroke();
        });
    }
    ////////// Return the position of desire lane////////////////
    getLaneCenter(laneId){
        laneId = laneId * (laneId >= 0 && laneId < this.laneCount)
        const laneWidth = this.width/this.laneCount;
        return this.left  + laneId*laneWidth + laneWidth/2;
    }
}
