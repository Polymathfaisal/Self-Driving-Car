class NeuralNetwork{
    constructor(neuronCounts){
        this.layers = [];
        for(let i=0; i < neuronCounts.length - 1; ++i){
            this.layers.push(new Layer(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }
    static feedForward(givenInput, network){
        for(let i=0; i < network.layers.length; ++i){
            givenInput = Layer.feedForward(
                givenInput, network.layers[i]
            )
        }
        return givenInput;
    }
    static mutate(network, amount = 1){
        network.layers.forEach(layer =>{
            for(let i=0; i < layer.outputCount; ++i){
                for(let j=0; j < layer.inputCount; ++j){
                    layer.weights[i][j] = lerp(
                        layer.weights[i][j], Math.random()*2-1, amount
                    )
                }
                layer.biases[i] = lerp(
                    layer.biases[i], Math.random()*2-1, amount
                )
            }
        });
    }
}

class Layer{
    constructor(inputCount, outputCount){
        this.inputCount = inputCount;
        this.outputCount = outputCount;

        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i=0; i < outputCount; ++i){
            this.weights[i] = new Array(inputCount);
        }

        Layer.#randomize(this);
    }

    static #randomize(layer){
        for(let i=0; i < layer.outputCount; i++){
            for(let j=0; j < layer.inputCount; j++){
                layer.weights[i][j] = Math.random()*2 - 1;
            }
            layer.biases[i] = Math.random()*2 - 1;
        }
    }
 
    //////// Activation calculation... A = sigma(WS + B) ......
    static feedForward(givenInput, layer){
        for(let i=0; i < layer.outputCount; ++i){
            let sum = 0;
            for(let j=0; j < layer.inputCount; ++j){
                sum += layer.weights[i][j]*givenInput[j];
            }
            //////// Here we are not using ReLu or Sigma function for simplicity....
            if(sum > layer.biases[i]) layer.outputs[i] = 1;
            else layer.outputs[i] = 0;
        }
        return layer.outputs;
    }
}
