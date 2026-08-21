export function imageHeightFromRatio(
  srcWidth: number, 
  srcHeight: number, 
  newWidth: number
) {
  return newWidth * (srcWidth / srcHeight);
}