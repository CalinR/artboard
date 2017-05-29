export default class CanvasObject {
    constructor({ x = 0, y = 0, width = 100, height = 100, rotation = 0 } = {}){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }

    render(context){
        context.save();
        context.fillStyle = '#ccc';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}