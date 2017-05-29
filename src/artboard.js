import ActionCanvas from './action-canvas'

export default class Artboard {
    constructor(element){
        this.canvas = element;
        this.context = element.getContext('2d');
        this.pixelRatio = window.devicePixelRatio || 1;
        this.width = element.width;
        this.height = element.height;
        this.objects = [];
        this.wrapElement(this.canvas);
        this.setRetina(this.canvas);
        this.isDirty = false;
        this.fps = 15;
        this.fpsInterval = 1000 / this.fps;
        this.last = Date.now();
        this.renderQueue = [];

        this.actionCanvas = new ActionCanvas(this);
        this.render();
    }

    updateObject(object, options){
        // object = {...object, options};

        for(const option in options){
            object[option] = options[option];
        }

        this.render();
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
        this.objects.push(object);
        this.render();
    }

    render(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(const object of this.objects){
            object.render(this.context);
        }
    }
}