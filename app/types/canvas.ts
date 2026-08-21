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
  public color: string = '#ffffff';
  public isSelected: boolean = false;
  public isMoving: boolean = false;
  public isResizing: boolean = false;
  public imageUrl: string = '';
  public image: HTMLImageElement = new Image();
};


export async function createCanvasImageItem(props: {
  width: number, 
  height: number, 
  imageUrl: string
}): Promise<CanvasItem> {
  const item = new CanvasItem();
  item.id = generateId();
  item.width = props.width;
  item.height = props.height;
  item.imageUrl = props.imageUrl;
  item.image = await imageLoad(props.imageUrl);
  item.type = ElementType.IMAGE;
  return item;
}

export function createCanvasShapeItem(props: {
  width: number,
  height: number,
  color: string,
} 
): CanvasItem {
  const item = new CanvasItem();
  item.id = generateId();
  item.width = props.width;
  item.height = props.height;
  item.color = props.color;
  item.type = ElementType.SHAPE;
  return item;
}