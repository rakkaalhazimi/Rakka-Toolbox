export function imageSize(url: string) {
  const image = new Image();
  image.src = url;
  return { width: image.width, height: image.height };
}