export default class ActionCanvas {
    constructor(parent){
        this.parent = parent;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
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
            object: null,
            selectedId: null
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
                    object: object,
                    selectedId: object.id
                });
            }
            else {
                this.setEvents({
                    selectedId: null
                })
            }

            this.render();
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

            this.render();
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
                    this.render();
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

    drawSelection(object){
        this.context.strokeRect(object.x, object.y, object.width, object.height);
    }

    drawAnchors(object){
        const left = object.x;
        const right = object.x + object.width;
        const top = object.y;
        const bottom = object.y + object.height;
        const anchorWidth = 30;

        this.context.fillStyle = '#fff';
        this.context.fillRect(right-(anchorWidth/2), top-(anchorWidth/2), anchorWidth, anchorWidth);
        this.context.strokeRect(right-(anchorWidth/2), top-(anchorWidth/2), anchorWidth, anchorWidth);
    }

    render(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.events.selectedId){
            const objectId = this.events.selectedId;
            for(const object of this.parent.objectList()){
                if(object.id == objectId){
                    this.drawSelection(object);
                    this.drawAnchors(object);
                    break;
                }
            }   
        }
    }
}