export function shapeRectDraw(
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
) {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, width, height);
}