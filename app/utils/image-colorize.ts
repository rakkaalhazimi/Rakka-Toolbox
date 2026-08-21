export function imageColorize(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  canvas: HTMLCanvasElement,
) {
  const ctx = canvas.getContext('2d')!;
  const imageData  = ctx.getImageData(x, y, width, height);
  const data = imageData.data;
  
  // Convert hex to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i] ?? 0;
    const green = data[i + 1] ?? 0;
    const blue = data[i + 2] ?? 0;
    
    const brightness = (red + green + blue) / 3;
    
    data[i]     = r * brightness / 255;
    data[i + 1] = g * brightness / 255;
    data[i + 2] = b * brightness / 255;
  }
  ctx.putImageData(imageData, x, y);
}