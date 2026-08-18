export function imageDraw(
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) {
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, x, y, width, height);
}