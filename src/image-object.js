import CanvasObject from './canvas-object'

export default class ImageObject extends CanvasObject {
    constructor({ x = 0, y = 0, width = 100, height = 100, rotation = 0, image = null, store = null } = {}){
        super({ x, y, width, height, rotation, store });
        this.image = image;
    }

    render(context){
        context.save();
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.restore();
    }
}