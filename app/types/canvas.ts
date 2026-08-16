export enum ElementType {
  IMAGE = 'IMAGE',
  SHAPE = 'SHAPE',
};


export type CanvasElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  imageUrl?: string;
};