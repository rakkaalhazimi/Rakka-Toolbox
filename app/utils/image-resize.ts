export function imageResize(
  targetWidth: number,
  targetHeight: number,
  image: HTMLImageElement,
) {
  let source: CanvasImageSource = image;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  while (
    sourceWidth / 2 > targetWidth &&
    sourceHeight / 2 > targetHeight
  ) {
    const newWidth = Math.floor(sourceWidth / 2);
    const newHeight = Math.floor(sourceHeight / 2);

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      source,
      0,
      0,
      sourceWidth,
      sourceHeight,
      0,
      0,
      newWidth,
      newHeight,
    );

    source = canvas;
    sourceWidth = newWidth;
    sourceHeight = newHeight;
  }

  // Final resize
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;

  const ctx = finalCanvas.getContext("2d")!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    source,
    0,
    0,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return finalCanvas;
}