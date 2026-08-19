export function shapeRectDraw(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  canvas: HTMLCanvasElement,
) {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}