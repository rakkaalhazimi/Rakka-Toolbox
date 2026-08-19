export class TShirtColor {
  constructor(public label: string, public hex: string) { };
};

export const tshirtColors = {
  WHITE: new TShirtColor('white', '#FFFFFF'),
  BLACK: new TShirtColor('black', '#18181B'),
  GRAY: new TShirtColor('gray', '#71717A'),
  GREEN: new TShirtColor('green', '#42B883'),
  BLUE: new TShirtColor('blue', '#3B82F6'),
  NAVY: new TShirtColor('navy', '#1E3A5F'),
  PURPLE: new TShirtColor('purple', '#8B5CF6'),
  RED: new TShirtColor('red', '#EF4444'),
  PINK: new TShirtColor('pink', '#EC4899'),
  YELLOW: new TShirtColor('yellow', '#EAB308'),
  ORANGE: new TShirtColor('orange', '#F97316'),
  BROWN: new TShirtColor('brown', '#92400E'),
  BEIGE: new TShirtColor('beige', '#D6C2A1'),
};
