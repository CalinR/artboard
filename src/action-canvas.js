export default class ActionCanvas {
    constructor(parent){
        this.parent = parent;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'action-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = 0;
        this.canvas.style.top = 0; 
        this.pixelRatio = window.devicePixelRatio || 1;
        canvas.parentNode.appendChild(this.canvas);
        this.canvas.width = this.parent.canvas.clientWidth;
        this.canvas.height = this.parent.canvas.clientHeight;
        this.width = this.parent.canvas.clientWidth;
        this.height = this.parent.canvas.clientHeight;
        this.offset = {
            x: this.canvas.getBoundingClientRect().left,
            y: this.canvas.getBoundingClientRect().top
        }
        this.setRetina(this.canvas);
        this.eventListeners();
        this.events = {
            click: false,
            dragging: false,
            offsetX: 0,
            offsetY: 0,
            object: null
        }
    }

    updateCanvas(){
        this.offset = {
            x: this.canvas.getBoundingClientRect().left,
            y: this.canvas.getBoundingClientRect().top
        }
    }

    setEvents(events){
        this.events = { ...this.events, ...events };
    }

    setRetina(canvas){
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
        canvas.width = this.width * this.pixelRatio;
        canvas.height = this.height * this.pixelRatio;
    }

    eventListeners(){

        document.onmousedown = (event) => {
            this.updateCanvas();
            const x = (event.pageX - this.offset.x) * this.pixelRatio;
            const y = (event.pageY - this.offset.y) * this.pixelRatio;
            const object = this.hitTest(x, y);

            if(object){
                this.setEvents({
                    click: true,
                    offsetX: object.x - x,
                    offsetY: object.y - y,
                    object: object
                });
            }
        }

        document.onmouseup = (event) => {
            this.setEvents({
                click: false,
                dragging: false,
                offsetX: 0,
                offsetY: 0,
                object: null
            });

            this.parent.applyFutureState();
        }

        document.onmousemove = (event) => {
            const x = (event.pageX - this.offset.x) * this.pixelRatio;
            const y = (event.pageY - this.offset.y) * this.pixelRatio;

            if(this.events.click){
                if(this.events.object){
                    this.parent.updateObject(this.events.object, {
                        x: x + this.events.offsetX,
                        y: y + this.events.offsetY
                    });
                }

                this.setEvents({
                    dragging: true
                });
            }
        }
    }

    hitTest(x, y){
        const objects = this.parent.objectList();

        for(let i=objects.length-1; i>=0; i--){
            const object = objects[i];
            if(x > object.x && y > object.y && x < object.x + object.width && y < object.y + object.height){
                return object;
            }
        }
    }
}