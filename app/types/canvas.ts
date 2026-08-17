export enum ElementType {
  IMAGE = 'IMAGE',
  SHAPE = 'SHAPE',
};


export type CanvasItem = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isDragging: boolean;
  imageUrl?: string;
};


export function createCanvasImageItem(props: {
  id: string, 
  width: number, 
  height: number, 
  imageUrl: string
}) {
  return {
    id: props.id,
    type: ElementType.IMAGE,
    x: 0,
    y: 0,
    width: props.width,
    height: props.height,
    isSelected: false,
    isDragging: false,
    imageUrl: props.imageUrl,
  } as CanvasItem
}