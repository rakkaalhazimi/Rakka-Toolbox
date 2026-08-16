export function imageDraw(
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  imageUrl: string,
) {
  const image = new Image();

  image.onload = () => {
    const ctx = canvas.getContext("2d")!;
    
    canvasClear(canvas);

    ctx.drawImage(
      image,
      x,
      y,
      width,
      height,
    );
  };

  image.src = imageUrl;
}