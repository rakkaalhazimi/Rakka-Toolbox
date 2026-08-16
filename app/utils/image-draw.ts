export function imageDraw(
  canvas: HTMLCanvasElement,
  imageUrl: string,
) {
  const image = new Image();

  image.onload = () => {
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
    );
  };

  image.src = imageUrl;
  return { width: image.width, height: image.height };
}