import ActionCanvas from './action-canvas'
import ImageObject from './image-object'

let objectId = 0;

export default class Artboard {
    constructor(element, callback){
        this.canvas = element;
        this.context = element.getContext('2d');
        this.pixelRatio = window.devicePixelRatio || 1;
        this.width = element.width;
        this.height = element.height;
        this.historyState = 0;
        this.futureState = null;
        this.history = [];
        this.wrapElement(this.canvas);
        this.setRetina(this.canvas);
        this.isDirty = false;
        this.fps = 15;
        this.fpsInterval = 1000 / this.fps;
        this.last = Date.now();
        this.renderQueue = [];
        this.actionCanvas = new ActionCanvas(this);
        this.updateStateCallback = callback;
        this.render();
    }

    undo(){
        if(this.historyState>0){
            this.historyState--;
            this.render();
        }
    }

    redo(){
        if(this.historyState<this.history.length-1){
            this.historyState++;
            this.render();
        }
    }

    objectList(){
        if(this.futureState){
            return this.futureState;
        }
        return this.history[this.historyState] || [];
    }

    updateObject(object, options){
        object = {...object, options}

        for(const option in options){
            object[option] = options[option];
        }

        const objects = this.objectList().map((obj) => {
            if(obj.id == object.id){
                return object;
            }
            return obj;
        })

        this.futureState = objects;
        
        this.render();
    }

    applyFutureState(){
        if(this.futureState){
            this.historyState++;
            if(this.historyState>0){
                this.history = this.history.slice(0, this.historyState);
            }
            this.history[this.historyState] = this.futureState;
            this.futureState = null;
        }

        if(this.updateStateCallback){
            this.updateStateCallback(this.history);
        }
    }

    wrapElement(canvas){
        const wrapper = document.createElement('div');
        wrapper.className = 'artboard-container';
        wrapper.style.position = 'relative';
        canvas.parentNode.insertBefore(wrapper, canvas);
        wrapper.appendChild(canvas);
    }

    setRetina(canvas){
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
        canvas.width = this.width * this.pixelRatio;
        canvas.height = this.height * this.pixelRatio;
    }

    add(object){
        const currentState = this.history[this.historyState] || [];
        objectId++;
        object.id = objectId;
        this.historyState++;
        if(this.historyState>0){
            this.history = this.history.slice(0, this.historyState);
        }
        this.history[this.historyState] = [...currentState, object];
        this.render();

        if(this.updateStateCallback){
            this.updateStateCallback(this.history);
        }
    }

    render(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(const object of this.objectList()){
            switch(object.type){
                case 'image':
                    this.context.drawImage(object.image, object.x, object.y, object.width, object.height);
                    break;
                case 'rectangle':
                    this.context.fillStyle = '#ddd';
                    this.context.fillRect(object.x, object.y, object.width, object.height);
                    break;

            }
        }
    }
}