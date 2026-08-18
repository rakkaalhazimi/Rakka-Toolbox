export enum ElementType {
  NULL = 'NULL',
  IMAGE = 'IMAGE',
  SHAPE = 'SHAPE',
};


const NULL_ID = '<NULL_ID>';

export class CanvasItem {
  public id: string = NULL_ID;
  public type: ElementType = ElementType.NULL;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public isSelected: boolean = false;
  public isMoving: boolean = false;
  public isResizing: boolean = false;
  public imageUrl: string = '';
  public image: HTMLImageElement = new Image();
};


export async function createCanvasImageItem(props: {
  id: string, 
  width: number, 
  height: number, 
  imageUrl: string
}): Promise<CanvasItem> {
  const item = new CanvasItem();
  item.width = props.width;
  item.height = props.height;
  item.imageUrl = props.imageUrl;
  item.image = await imageLoad(props.imageUrl);
  item.type = ElementType.IMAGE;
  return item;
}