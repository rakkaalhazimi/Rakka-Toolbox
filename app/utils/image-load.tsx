export function imageLoad(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = imageUrl;
    image.onerror = reject;
    
    image.onload = () => resolve(image);
  });
}