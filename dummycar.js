class dummyCar{
    constructor(x, y, width, height, speed = 2){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height= height;
        this.speed = speed;
        this.points = [];

        this.img = new Image();
        this.img.src = "image//Ycar.png";
    }

    update(){
        this.y -= this.speed;
        this.points = [];
        ////////// Update the curent possition of dummy Car ////////
        let dir = [[1,1],[1,-1],[-1,-1],[-1,1]];
        for(let i=0; i < 4; ++i){
            this.points.push({
                x : this.x + dir[i][0]*this.width/2,
                y : this.y + dir[i][1]*this.height/2
            })
        }
    }

    draw(contex){
        contex.save();
        contex.translate(this.x, this.y);
        contex.drawImage(
            this.img,
            - this.width/2,
            - this.height/2,
            this.width,
            this.height
        );
        contex.restore(); 
        /*----------------------------------------
        contex.fillStyle ="red";
        contex.beginPath();
        let i = 0;
        this.points.forEach(vertex => {
            if(i == 0) contex.moveTo(vertex.x, vertex.y);
            else contex.lineTo(vertex.x, vertex.y);
            ++i;
        })
        contex.fill();
        ----------------------------------------------*/
    }
}