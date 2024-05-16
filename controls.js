class Controls{
    constructor(useAI){
        this.forward = false;
        this.left = false;
        this.right =false;
        this.reverse = false;
        if(!useAI) this.#addKeyBoardListensers();
    }

    #addKeyBoardListensers(){
        /////// Controls the movement on key pressing /////////////
        document.onkeydown = (event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right =true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }

        /////////Stop the movment of car on key release /////////////
        document.onkeyup = (event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right =false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }

    addAIListensers(outputs){
        this.forward = outputs[0];
        this.left = outputs[1];
        this.right = outputs[2];
        this.reverse = outputs[3];
    }
}