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
};


export function createCanvasImageItem(props: {
  id: string, 
  width: number, 
  height: number, 
  imageUrl: string
}) {
  const item = new CanvasItem();
  item.width = props.width;
  item.height = props.height;
  item.imageUrl = props.imageUrl;
  item.type = ElementType.IMAGE;
  return item;
}